import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

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
    
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException{
		// TODO Auto-generated method stub
		String ip = request.getHeader("X-Forwarded-For");
	    if (ip == null) ip = request.getRemoteAddr();
	    
	    LocalDateTime now = LocalDateTime.now();
		String formdatenow = now.format(DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH시 mm분 ss초"));
		
		String path = "D:\\LSWUpload\\"+ip;
		String realPath = "D:\\LSWUpload\\Uploaded";
		File folder = new File(path);
		String log = "\n";
		
		if (!folder.exists()) {
			try{
			    folder.mkdir();
		        } 
		        catch(Exception e){
			    e.getStackTrace();
			}     
		}

		
		// 이어올리기는 전에 체크 해야된다.
	    try {			    
			InputStream yesno = request.getPart("yesno").getInputStream();
			InputStreamReader yesnoReader = new InputStreamReader(yesno);
			Stream<String> yesnoString= new BufferedReader(yesnoReader).lines();
		    String yn = yesnoString.collect(Collectors.joining());
		    
			InputStream postNumIs = request.getPart("postNum").getInputStream();
			InputStreamReader postNumReader = new InputStreamReader(postNumIs);
			Stream<String> postNumString= new BufferedReader(postNumReader).lines();
		    String postNum = postNumString.collect(Collectors.joining());
		    
		    //System.out.println(postNum);
	
			//////////////////////// Part&Write ////////////////////////
			log+="========="+ip+"=========\n";
			log+="==="+formdatenow+"==\n";
			log+="postNum : ["+postNum+"]\n";
			Collection<Part> parts = request.getParts();
			for (Part part : parts) {
				if(part.getContentType()!=null) {
					String fileName = part.getName();
					
					InputStream fnis = request.getPart(fileName+" size").getInputStream();
					InputStreamReader inputStreamReader = new InputStreamReader(fnis);
					Stream<String> streamOfString= new BufferedReader(inputStreamReader).lines();
				    long fileSize = Long.parseLong(streamOfString.collect(Collectors.joining()));
					
					//System.out.printf("파라미터 명 : %s, contentType :  %s,  size : %d bytes \n", part.getName(),part.getContentType(), part.getSize());
					log+="<업로드> "+fileName+"\n";
	
					File checkFile = new File(path+"\\["+postNum+"] "+fileName);
				    if(yn.equals("NO")&&checkFile.exists()) {
				    	checkFile.delete();
				    }
	
					if(checkFile.exists()) {
						FileOutputStream stream = new FileOutputStream(path+"\\["+postNum+"] "+fileName, true);
						InputStream is = part.getInputStream();
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
					}
					else { // notExist
						if(part.getSize()!=0) {
							part.write(path+"\\["+postNum+"] "+fileName);
						}
					}
	
					checkFile = new File(path+"\\["+postNum+"] "+fileName);
					
					if(checkFile.length() == fileSize) {
						Path oldfile = Paths.get(path+"\\["+postNum+"] "+fileName);
						Path newfile = Paths.get(realPath+"\\["+postNum+"] "+fileName);
						File nf = new File(realPath+"\\["+postNum+"] "+fileName);
						int i = 1;
						String newName = "";
						while(nf.exists()) {
							int li = fileName.lastIndexOf(".");
							newName = fileName.substring(0, li)+"("+i+")"+fileName.substring(li, fileName.length());
							newfile = Paths.get(realPath+"\\["+postNum+"] "+newName);
							nf = new File(realPath+"\\["+postNum+"] "+newName);
							i++;
						}
						if(newName!="") {log+="└><중복된 파일명 변경> "+newName+"\n";}
						Files.move(oldfile, newfile, StandardCopyOption.ATOMIC_MOVE);
						checkFile.delete();
						log+="=================================";
						System.out.println(log);
					}
				}
			}
			
			File postList = new File(realPath+"\\#LSW_POSTED_NUMBER.txt");
			BufferedWriter writer = new BufferedWriter(new FileWriter(postList,true));
			BufferedReader reader = new BufferedReader(new FileReader(postList));
			boolean exist = false;
			String str;
			while (( str = reader.readLine()) != null) {
				if(str.equals(postNum)) {
					exist = true;
					break;
				}
			}
			if(!exist || str == null) {
				writer.write(postNum+"\n");
			}
			
			
			reader.close();
			writer.close();
			////////////////////////////////////////////////////////////
			
			/*
			//////////////////////////// COS ///////////////////////////
			int size = (1024 * 1024 * 2048)-1;
			MultipartRequest multi = new MultipartRequest(request, path, size, "UTF-8");
			Enumeration fileNames = multi.getFileNames();
			log+="========="+ip+"=========\n";
			log+="==="+formdatenow+"==\n";
			String val = "";
			String fileSize = "";
			while(fileNames.hasMoreElements()) {
				val = (String) fileNames.nextElement();
				log+="<업로드> "+val+"\n";
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
						if(newName!="") {log+="└><중복된 파일명 변경> "+newName+"\n";}
						Files.move(oldfile, newfile, StandardCopyOption.ATOMIC_MOVE);
						checkFile.delete();
					}
				}
				else { // notExist
					log+="fileNotFound\n";
				}
			}
			log+="=================================";
			System.out.println(log);
			////////////////////////////////////////////////////////////
			*/
	    }catch(Exception e) {
			log+="========="+ip+"=========\n";
			log+="==="+formdatenow+"==\n";
	    	log+="============<업로드 중단>===========\n";
	    	log+="=================================";
			System.out.println(log);
	    }
	}

}
