

import java.io.File;
import java.io.IOException;

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
    	String postNum = request.getParameter("postNum");
		
    	String path = "D:\\LSWUpload\\Uploaded";
    	File dir = new File(path);
    	File files[] = dir.listFiles();

    	for (int i = 0; i < files.length; i++) {
    		if(files[i].getName().equals("#LSW_POSTED_NUMBER.txt")) {
    			continue;
    		}
    		int start = files[i].getName().indexOf("[");
    		int end = files[i].getName().indexOf("]");
    		String number = files[i].getName().substring(start+1,end);
    		if(number.equals(postNum)) {
    			String tempName = files[i].getName();
        	    response.getWriter().write(tempName.substring(end+2,tempName.length())+"/");
        	    response.getWriter().write(Long.toString(files[i].length())+"/");
    		}
    	}
    }

}
