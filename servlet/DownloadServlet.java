

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
	    String s = String.valueOf(percentIp.get(ip));
	    response.getWriter().write(s);
    }
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String path = "D:\\LSWUpload\\Uploaded\\";
		String val = "";
		int size = (1024 * 1024 * 2000) + 1;
		LocalDateTime now = LocalDateTime.now();
		String formatedNow = now.format(DateTimeFormatter.ofPattern("yyyy.MM.dd. HH_mm_ss"));
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    percentIp.put(ip,0);
	    String log = "\n";
		
		MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8");
		
		Enumeration fileNames = multi.getParameterNames();
		
    	File file = null;
    	List<File> files = new ArrayList<>();
    	
    	//int sum = 0;
    	
    	log+="========="+ip+"=========\n";
		while(fileNames.hasMoreElements()) {
    		path = "D:\\LSWUpload\\Uploaded\\";
			val = (String) fileNames.nextElement();
			val = multi.getParameter(val);
			path += val;
			file = new File(path);
			files.add(file);
			//sum+=(int)file.length()+1;
			log+="<다운로드> "+val+"\n";
		}
		log+="=================================";
		
		if(files.size()>1) {
			File zip = new File("D:\\LSWUpload\\"+ip+", "+formatedNow+".zip");
			//System.out.println(zip);
			byte[] b =new byte[10000];
			double progressD = 0;
			double whole = 0;
			for (File f : files) {whole += f.length();}
			double percent = 0;
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
	                        percentIp.put(ip,percent);
	                        if (bytesBuffered > 1024 * 1024 * 25) {
	                            bytesBuffered = 0;
	                            out.flush();
	                            //percent = Math.round(progressD/whole*10000)/100.00;
	                            //s = String.valueOf(percent);
	                            //System.out.println(percent);
	                        }
	                    }
	                    b = new byte[10000];
	                    out.closeEntry();
	                }
	            }
	            percent = 100.00;
	            percentIp.put(ip,percent);
	            //System.out.println(percent);
	        }
			
			FileInputStream in2 = new FileInputStream(zip);
			String mimeType = getServletContext().getMimeType(zip.toString());
			if(mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
	        String sEncoding = new String(zip.getName().getBytes("UTF-8"));
	        String value = "attachment;filename=\""+sEncoding+"\"";
	        response.setHeader("Content-Disposition", value);
	        response.setContentLengthLong(zip.length());
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
			byte[] b = new byte[10000];
			FileInputStream in = new FileInputStream(file);
			String mimeType = getServletContext().getMimeType(file.toString());
			if(mimeType == null) {
				mimeType = "application/octet-stream";
			}
			response.setContentType(mimeType);
			String fileName = val;
			String sEncoding = new String(fileName.getBytes("UTF-8"));
		    String value = "attachment;filename=\""+sEncoding+"\"";
		    response.setHeader("Content-Disposition", value);
		    response.setContentLengthLong(file.length());
		    ServletOutputStream out = response.getOutputStream();
		        
		    int read = 0;
            int bytesBuffered = 0;
		    while((read = in.read(b,0,b.length))!= -1){
		     	out.write(b,0,read);
                bytesBuffered += read;
                if (bytesBuffered > 1024 * 1024 * 25) {
                    bytesBuffered = 0;
                    out.flush();
                }
		    }
		    in.close();
		    out.close();
		}
		System.out.println(log);
	}

}