import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;


@WebServlet("/UploadServlet")
public class UploadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public UploadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    
		String path = "D:\\LSWUpload\\"+ip;
		String realPath = "D:\\LSWUpload\\Uploaded";
		File folder = new File(path);
		
		if (!folder.exists()) {
			try{
			    folder.mkdir();
		        } 
		        catch(Exception e){
			    e.getStackTrace();
			}     
		}
		
		// 이어올리기는 전에 체크 해야된다.
		int size = (1024 * 1024 * 2048)-1;
		MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8");
		
		Enumeration fileNames = multi.getFileNames();
		System.out.println();
		System.out.println("======="+ip+"=======");
		String val = "";
		String fileSize = "";
		while(fileNames.hasMoreElements()) {
			val = (String) fileNames.nextElement();
			System.out.println("<업로드> "+val);
			fileSize = multi.getParameter(val+" size");
			Long longSize = Long.parseLong(fileSize);
			File checkFile = new File(path+"\\"+val);
			
			if(checkFile.exists()) {
				if(checkFile.length() == longSize) {
					Path oldfile = Paths.get(path+"\\"+val);
					Path newfile = Paths.get(realPath+"\\"+val);
					File nf = new File(realPath+"\\"+val);
					int i = 1;
					String newName = "";
					while(nf.exists()) {
						int li = val.lastIndexOf(".");
						newName = val.substring(0, li)+"("+i+")"+val.substring(li, val.length());
						newfile = Paths.get(realPath+"\\"+newName);
						nf = new File(realPath+"\\"+newName);
						i++;
					}
					if(newName!="") {System.out.println("└><중복된 파일명 변경> "+newName);}
					Files.move(oldfile, newfile, StandardCopyOption.ATOMIC_MOVE);
					checkFile.delete();
				}
				else {
					System.out.println("덜올림");
				}
			}
			else { // notExist
				System.out.println("fileNotFound");
			}
		}
		System.out.println("=============================");
	}

}
