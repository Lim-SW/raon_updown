import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
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
		
		//response.setContentType("text/html");
		//response.setCharacterEncoding("UTF-8");
		//PrintWriter out = response.getWriter();
		
		String path = "D:\\LSWUpload\\Uploaded";
		int size = (1024 * 1024 * 2000) + 1;
		MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8", new DefaultFileRenamePolicy());
		
	    String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
		
		Enumeration fileNames = multi.getFileNames();
		System.out.println("======="+ip+"=======");
		while(fileNames.hasMoreElements()) {
			String val = (String) fileNames.nextElement();
			System.out.println("<업로드> "+val);
		}
		System.out.println("=============================");
		
		// 프로그래스바 띄우라고 한다 vs 프로그래스바 띄운다
		// 다 되면 성공응답 보내기 => js 파일로
	}
}
