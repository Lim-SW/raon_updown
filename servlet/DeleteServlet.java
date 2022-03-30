
import java.io.File;
import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;

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
		MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8", new DefaultFileRenamePolicy());
    	Enumeration fileNames = multi.getParameterNames();
		
	    String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    String log = "\n";
    	
    	File file = null;
    	log+="========="+ip+"=========\n";
    	while(fileNames.hasMoreElements()) {
    		path = "D:\\LSWUpload\\Uploaded\\";
			val = (String) fileNames.nextElement();
			val = multi.getParameter(val);
			path += val;
			file = new File(path);
			file.delete();
			log+="<파일삭제> "+val;
		}
    	log+="=================================";
	}

}
