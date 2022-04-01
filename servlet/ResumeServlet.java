

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ResumeServlet
 */
@WebServlet("/ResumeServlet")
public class ResumeServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ResumeServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 여기 아마 퍼센트 받아야할거임
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// 여기에서 파일 합치면 됨
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    String log = "\n";
	    
	    log+="========="+ip+"=========\n";
	    
		String path = "D:\\LSWUpload\\"+ip;
		String realPath = "D:\\LSWUpload\\Uploaded";
		
		InputStream is = request.getPart("chunk").getInputStream();
		InputStream fn = request.getPart("name").getInputStream();
		InputStreamReader fnir = new InputStreamReader(fn);
		Stream<String> streamOfString= new BufferedReader(fnir).lines();
        String fileName = streamOfString.collect(Collectors.joining());
        log+="<이어올리기> "+fileName+"\n";

        InputStream fs = request.getPart("size").getInputStream();
        InputStreamReader inputStreamReader = new InputStreamReader(fs);
        Stream<String> sfs= new BufferedReader(inputStreamReader).lines();
        long fileSize = Long.parseLong(sfs.collect(Collectors.joining()));
        
        FileOutputStream stream = new FileOutputStream(path+"\\"+fileName, true);

        int read;
        byte[] b =new byte[10000];
        int bytesBuffered = 0;
        while((read = is.read(b,0,b.length))!= -1){
        	stream.write(b,0,read);
            bytesBuffered += read;
            if (bytesBuffered > 1024 * 1024 * 25) {
                bytesBuffered = 0;
                stream.flush();
            }
        }
        
	    is.close();
	    stream.close();
	    
	    File checkFile = new File(path+"\\"+fileName);
	    if(checkFile.exists()) {
			if(checkFile.length() == fileSize) {
				Path oldfile = Paths.get(path+"\\"+fileName);
				Path newfile = Paths.get(realPath+"\\"+fileName);
				File nf = new File(realPath+"\\"+fileName);
				int i = 1;
				String newName = "";
				while(nf.exists()) {
					int li = fileName.lastIndexOf(".");
					newName = fileName.substring(0, li)+"("+i+")"+fileName.substring(li, fileName.length());
					newfile = Paths.get(realPath+"\\"+newName);
					nf = new File(realPath+"\\"+newName);
					i++;
				}
				if(newName!="") {log+="└><중복된 파일명 변경> "+newName+"\n";}
				Files.move(oldfile, newfile, StandardCopyOption.ATOMIC_MOVE);
				checkFile.delete();			
			}
		}
		else { // notExist
			log+="fileNotFound\n";
		}
	    log+="=================================";
	    System.out.println(log);
	}
}
