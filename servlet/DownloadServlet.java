

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.oreilly.servlet.MultipartRequest;
import com.oreilly.servlet.multipart.DefaultFileRenamePolicy;


@WebServlet("/DownloadServlet")
public class DownloadServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    public DownloadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String path = "D:\\LSWUpload\\Uploaded";
		String val = "";
		int size = (1024 * 1024 * 2000) + 1;
		MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8", new DefaultFileRenamePolicy());
		
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
		
		Enumeration fileNames = multi.getParameterNames();
		
    	File file = null;
    	
		System.out.println();
		System.out.println("======="+ip+"=======");
		while(fileNames.hasMoreElements()) {
    		path = "D:\\LSWUpload\\Uploaded\\";
			val = (String) fileNames.nextElement();
			val = multi.getParameter(val);
			path += val;
			file = new File(path);
			// 여기서 다운로드 시켜
			byte[] b =new byte[(int)file.length()+1];
			FileInputStream in =new FileInputStream(file);
			String mimeType = getServletContext().getMimeType(path);
			if(mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
	        String sEncoding = new String(file.getName().getBytes("UTF-8"));
	        String value = String.format("attachment; fileName= \"%s\"" , sEncoding);
	        response.setHeader("Content-Disposition", value);
	        OutputStream out = response.getOutputStream();
	        
	        int read;
	        while((read = in.read(b,0,b.length))!= -1){
	        	out.write(b,0,read);
	        }
	        in.close();
	        out.close();
			System.out.println("<다운로드> "+val);
		}
		System.out.println("=============================");
	}

}
