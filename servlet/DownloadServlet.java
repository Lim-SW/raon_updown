

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

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
    private static Map percentIp = new HashMap<>();
       
    public DownloadServlet() {
        super();
        // TODO Auto-generated constructor stub
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
    	response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		response.setHeader("Pragma", "no-cache");
		response.setHeader("Expires", "0");
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    String randomnumber = request.getParameter("num");
		//System.out.println(randomnumber);
	    String s = String.valueOf(percentIp.get(ip+","+randomnumber));
	    response.getWriter().write(s);
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String path = "D:\\LSWUpload\\Uploaded\\";
		String val = "";
		int size = (1024 * 1024 * 2000) + 1;
		LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    
	    String log = "\n";
		
		MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8");
		
		Enumeration fileNames = multi.getParameterNames();
		
    	File file = null;
    	List<File> files = new ArrayList<>();
    	String randomnumber = "";
		double progressD = 0;
		double whole = 0;
		double percent = 0;
    	
    	log+="========="+ip+"=========\n";
    	log+="==="+formdatenow+"==\n";
		while(fileNames.hasMoreElements()) {
    		path = "D:\\LSWUpload\\Uploaded\\";
			val = (String) fileNames.nextElement();
			val = multi.getParameter(val);
			if(val.contains(".")) {
				path += val;
				file = new File(path);
				files.add(file);
				log+="<다운로드> "+val+"\n";
			}
			else {
				randomnumber = val;
				percentIp.put(ip+","+randomnumber,0);
			}
		}
		log+="=================================";
		
		if(files.size()>1) {
			File zip = new File("D:\\LSWUpload\\LSWUp&Down_"+ip+", "+formdatenow+".zip");
			//System.out.println(zip);
			byte[] b =new byte[10000];
			for (File f : files) {whole += f.length();}
			//String s = "";
	        try (ZipOutputStream out = new ZipOutputStream(new FileOutputStream(zip))) {
	            for (File f : files) {
	                try (FileInputStream in = new FileInputStream(f)) {
	                    ZipEntry ze = new ZipEntry(f.getName());
	                    out.putNextEntry(ze);
	 
	                    int len = 0;
	                    int bytesBuffered = 0;
	                    while ((len = in.read(b)) > 0) {
	                    	progressD += len;
	                        out.write(b, 0, len);
	                        bytesBuffered += len;
	                        percent = Math.round(progressD/whole*10000)/100.00;
	                        percentIp.put(ip+","+randomnumber,percent);
	                        if (bytesBuffered > 1024 * 1024 * 25) {
	                            bytesBuffered = 0;
	                            out.flush();
	                        }
	                    }
	                    b = new byte[10000];
	                    out.closeEntry();
	                }
	            }
	            percent = 100.00;
	            percentIp.put(ip+","+randomnumber,percent);
	            //System.out.println(percent);
	        }
			
			FileInputStream in2 = new FileInputStream(zip);
			String mimeType = getServletContext().getMimeType(zip.toString());
			if(mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
	        String sEncoding = new String(zip.getName().getBytes("euc-kr"),"8859_1");
	        String value = "attachment;filename=\""+sEncoding+"\"";
	        response.setHeader("Content-Disposition", value);
	        //response.setContentLengthLong(zip.length());
	        
	        ServletOutputStream out2 = response.getOutputStream();
	        
	        int read;
	        while((read = in2.read(b,0,b.length))!= -1){
	        	out2.write(b,0,read);
	        }
	        in2.close();
	        out2.close();
	        zip.delete();
			//System.out.println(zip);
        }
		
		else {
			whole = file.length();
			byte[] b = new byte[10000];
			FileInputStream in = new FileInputStream(file);
			String mimeType = getServletContext().getMimeType(file.toString());
			if(mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			String fileName = val;
			String sEncoding = new String(fileName.getBytes("euc-kr"),"8859_1");
		    String value = "attachment;filename=\""+sEncoding+"\"";
		    response.setHeader("Content-Disposition", value);
		    //response.setContentLengthLong(file.length());
		    
		    ServletOutputStream out = response.getOutputStream();
		    
		    int read = 0;
            int bytesBuffered = 0;
		    while((read = in.read(b,0,b.length))!= -1){
		    	progressD += read;
		     	out.write(b,0,read);
                bytesBuffered += read;
                percent = Math.round(progressD/whole*10000)/100.00;
                percentIp.put(ip+","+randomnumber,percent);
                if (bytesBuffered > 1024 * 1024 * 25) {
                    bytesBuffered = 0;
                    out.flush();
                }
		    }
            percent = 100.00;
            percentIp.put(ip+","+randomnumber,percent);
		    in.close();
		    out.close();
		}
		System.out.println(log);
	}

}