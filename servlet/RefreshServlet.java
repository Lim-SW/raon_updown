

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class RefreshServlet
 */
@WebServlet("/RefreshServlet")
public class RefreshServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public RefreshServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

    protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
    	
    	String path = "D:\\LSWUpload\\Uploaded";
    	File dir = new File(path);
    	File files[] = dir.listFiles();

    	for (int i = 0; i < files.length; i++) {
    	    //out.println(files[i].getName()+"<BR>");
    	    //out.println(files[i].length()+"<BR>");
    	    response.getWriter().write(files[i].getName()+"/");
    	    response.getWriter().write(Long.toString(files[i].length())+"/");
    	}
    }

}
