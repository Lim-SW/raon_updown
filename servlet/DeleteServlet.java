
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;

/**
 * Servlet implementation class DeleteServlet
 */
@WebServlet("/DeleteServlet")
public class DeleteServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public DeleteServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String path = "D:\\LSWUpload\\Uploaded\\";
		String val = "";
		
    	int size = (1024 * 1024 * 2000) + 1;
		MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8");
    	Enumeration<?> fileNames = multi.getParameterNames();
    	LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
		
	    String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    String log = "\n";
	    String postNum = multi.getParameter("postNum");
	    
    	File file = null;
    	log+="========="+ip+"=========\n";
    	log+="==="+formdatenow+"==\n";
    	fileNames = multi.getParameterNames();
    	while(fileNames.hasMoreElements()) {
    		path = "D:\\LSWUpload\\Uploaded\\";
			val = (String) fileNames.nextElement();
			if(val.equals("postNum")) {
				continue;
			}
			val = multi.getParameter(val);
			path += "["+postNum+"] "+val;
			file = new File(path);
			file.delete();
			log+="<파일삭제> "+val+"\n";
    	}
    	log+="=================================";
    	System.out.println(log);
    	
    	path = "D:\\LSWUpload\\Uploaded\\";
    	File dir = new File(path);
		File postList = new File(path+"\\#LSW_POSTED_NUMBER.txt");

		boolean exist = false;
		String str;
		
		File files[] = dir.listFiles();
		
		for (int i = 0; i < files.length; i++) {
			if(files[i].getName()=="#LSW_POSTED_NUMBER.txt") {
				continue;
			}
		    if(files[i].getName().substring(0,postNum.length()+2).equals("["+postNum+"]")) {
		    	exist = true;
		    }
		}
		
		ArrayList<String> al = new ArrayList<String>();
		
		if(!exist) {
			BufferedReader reader = new BufferedReader(new FileReader(postList));
			while (( str = reader.readLine()) != null) {
				if(str.equals(postNum)) {
					exist = true;
				}
				else {
					al.add(str);
				}
			}
			BufferedWriter writer = new BufferedWriter(new FileWriter(postList));
			for(int i=0;i<al.size();i++) {
				writer.write((String)al.get(i));
				writer.newLine();
			}
			reader.close();
			writer.close();
		}
	}

}
