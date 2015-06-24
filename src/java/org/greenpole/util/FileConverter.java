/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.util;

import com.lowagie.text.DocumentException;
import java.io.ByteArrayOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Map;
import java.util.Set;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServlet;
import javax.xml.parsers.ParserConfigurationException;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFRichTextString;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.xhtmlrenderer.pdf.ITextRenderer;
import org.xml.sax.SAXException;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm)
 */
public class FileConverter extends HttpServlet {
    @Autowired
    ServletContext context;
    public static int MS_EXCEL = 1;
    public static int PDF = 2;
    public static int CSV = 3;
    
    public byte [] exportData(Map <String,String> header,Map <String,Object[]> data,String title,int mode) throws IOException, DocumentException, URISyntaxException, ParserConfigurationException, SAXException{
        byte [] exportedData =null;
        switch(mode){
            case 1:
                exportedData = exportToMSEXCEL(header,data,title);
                break;
            case 2:
                System.out.println("to pdf");
                exportedData = exportToPDF(header,data,title);
                break;
            case 3:
                exportedData = exportToCSV(header,data,title);
                break;
            default :
                break;
        }
        return exportedData;
    }
    
     private byte[] exportToCSV (Map <String,String> header,Map <String,Object[]> data,String title) throws IOException{
         Set<String> keySet = data.keySet();
         Set<String> headerKeySet = header.keySet();
         String output = "";
          for(String headerKey :headerKeySet){
            output+=header.get(headerKey)+",";
            
        }
         for(String key: keySet){
            
            Object[] objArr = data.get(key);
            for(Object obj : objArr){
                output+=obj.toString()+",";
            }
           
        } 
         output+="\n";
         System.out.println(output);
         return output.getBytes();
    }
     
    private byte[] exportToMSEXCEL(Map <String,String> header,Map <String,Object[]> data,String title) throws IOException{
       
        XSSFWorkbook workbook = new XSSFWorkbook();
        XSSFSheet sheet = workbook.createSheet(title);
        int rownumber = 0;
        Set<String> headerKeySet = header.keySet();
        Utility util = new Utility();
        Set<String> keySet = data.keySet();
        int c_num=0;
        Row row = sheet.createRow(rownumber);
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        for(String headerKey :headerKeySet){
            XSSFRichTextString string = new XSSFRichTextString(header.get(headerKey));
            string.applyFont(font);
            Cell cell = row.createCell(c_num);
            cell.setCellValue(string);
            c_num++;
        }
        rownumber++;
        for(String key: keySet){
            row = sheet.createRow(rownumber);
            rownumber++;
            Object[] objArr = data.get(key);
            setRowValues(objArr, row);
        }
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        workbook.write(os);
        return os.toByteArray();
    }
    
    private void setRowValues(Object[] objArr,Row row){
        int cellNumber = 0;
        for(Object obj : objArr){
            
                Cell cell = row.createCell(cellNumber);
                cellNumber++;
                if(obj instanceof String)
                    cell.setCellValue((String) obj);
                else if(obj instanceof Integer)
                    cell.setCellValue((Integer) obj);
                else
                    cell.setCellValue((Double) obj);
        }
        
    }
    
    public byte[] exportToPDF(Map <String,String> header,Map <String,Object[]> data,String title) throws IOException, DocumentException, URISyntaxException, ParserConfigurationException, SAXException{
        //HttpServlet servlet = this.context ;
        Utility util = new Utility();
        //String cssfile = getServletContext().getRealPath("/WEB-INF/viewList/resources/styles/vendor/foundation.min.css");
       // System.out.println(cssfile);
        StringBuilder tableStringBuilder = new StringBuilder ();
       // String table="border-spacing:0px;background: white;margin-bottom: 1.25rem; border: solid 1px #000;font-family:'Century Gothic';font-size:10px";
        tableStringBuilder.append("<html>"
                + "<head>"
                + "<style>\n#t4{-fs-table-paginate:paginate;border-spacing:0}\n" +
"#t4 td {\n" +
"  display:table-cell;\n" +
"  line-height:1.125rem;"
+ "\n" +
"}\n"
                + "#t4 tr{border-bottom:1px solid #000}" +
"#t4 tr.firstrow td{border-top-width:1px}"
+ "#t4 tr:nth-of-type(even) {\n" +
"  background:#EFEEEE;border:1px solid #000\n" +
"}" +
"#t4 td.firstcol{border-left:1px solid #000;}\n"
                + "</style>"
                + "</head>"
                + "<body>");
        tableStringBuilder.append("<table id='t4' cellpadding='0' border=\"0\" cellspacing='0' width='100%'>");
        Set<String> headerKeySet = header.keySet();
        tableStringBuilder.append("<tr style=\"line-height:20px\">");
        for(String headerKey :headerKeySet){  
            System.out.println("header="+headerKey);
            tableStringBuilder.append("<td align=\"center\" style=\"font-weight:bold;font-size:10px;padding-top:5px;padding-bottom:5px\">").append(header.get(headerKey)).append("</td>");
        }
        tableStringBuilder.append("</tr>");
        System.out.println(tableStringBuilder.toString());
        Set<String> keySet = data.keySet();
        
        int row = 1;
        String even = "background: #efeeee;color:#000;font-size:10px;padding-top:5px;padding-bottom:5px;padding-left:5px";
        String odd = "color:#000;font-size:10px;padding-top:5px;padding-bottom:5px;padding-left:5px";
        String style = "";
        String _style ="";
        for(String key: keySet){
            int index=0;
            Object[] objArr = data.get(key);
            style = (row%2 == 0) ? even : odd;
            tableStringBuilder.append("<tr><td style=\"").append(style).append("\">").append(row).append("</td>");
            
            for(Object obj : objArr){
                 /*if(index == (objArr.length-1)){
                     tableStringBuilder.append("<td style=\"").append(style).append("\">");
                    tableStringBuilder.append(obj.toString());
                    tableStringBuilder.append("</td>");
                 }
                 else{*/
                
                     tableStringBuilder.append("<td style=\"").append(style).append("\">");
                    tableStringBuilder.append(obj.toString());
                    tableStringBuilder.append("</td>");
                // }
                 
               
                 index++;
            }
            row++;
            tableStringBuilder.append("</tr>");
        }
        tableStringBuilder.append("</table>"
                + "</body>"
                + "</html>");
        System.out.println(tableStringBuilder.toString());
           ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(tableStringBuilder.toString());
            renderer.layout();
            ByteArrayOutputStream os = new ByteArrayOutputStream();
        renderer.createPDF(os);
        renderer.finishPDF();
        os.close();
        return os.toByteArray();
        /* HtmlCleaner cleaner = new HtmlCleaner ();String url
        CleanerProperties props = cleaner.getProperties();
        TagNode node = cleaner.clean(new URL(url));
        new PrettyXmlSerializer(props).writeToStream(node, System.out);
        ITextRenderer renderer = new ITextRenderer ();
        FontResolver resolver = renderer.getFontResolver();
        renderer.getFontResolver().addFont("C:\\WINDOWS\\FONTS\\gothic.TTF", true);
        renderer.setDocument(new URL(url).toString());
        renderer.layout();
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        renderer.createPDF(os);
        renderer.finishPDF();
        os.close();
        return os.toByteArray();
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter writer = PdfWriter.getInstance(document, os);
        document.open();
        document.add(new Paragraph(title));
        document.add(Chunk.NEWLINE);
        PdfPTable table = getTable(header,data);
        document.add(table);
        document.close();
        return os.toByteArray();
        return null;*/
       // return null;
    }
    
    /*public PdfPTable getTable(Map <String,Object[]> header,Map <String,Object[]> data) throws CssResolverException, URISyntaxException, MalformedURLException, FileNotFoundException, IOException{
        StringBuilder tableStringBuilder = new StringBuilder ();
        tableStringBuilder.append("<table cellpadding=\"0\" cellspacing=\"0\" border=\"1\" width=\"100%\" style=\"border-spacing:0px\" >");
        Set<String> headerKeySet = header.keySet();
        tableStringBuilder.append("<tr>");
        for(String headerKey :headerKeySet){            
            tableStringBuilder.append("<td align=\"center\" style=\"font-weight:bold;font-size:11px\">").append(headerKey).append("</td>");
        }
        tableStringBuilder.append("</tr>");
        Set<String> keySet = data.keySet();
        for(String key: keySet){
            Object[] objArr = data.get(key);
            System.out.println(objArr.toString());
            System.out.println(tableStringBuilder);
            tableStringBuilder.append(setPDFRow(objArr, tableStringBuilder).toString());
        }
        tableStringBuilder.append("</table>");
        Utility util=new Utility();
        URI startURI=new URI(context.getResource("/WEB-INF/viewList/").toString());
        String css=util.lookUpFile("foundation.min.css",startURI);
        CSSResolver cssResolver = new StyleAttrCSSResolver();
        CssFile cssFile = XMLWorkerHelper.getCSS(new FileInputStream(new File(css)));
        cssResolver.addCss(cssFile);
        
        HtmlPipelineContext htmlContext = new HtmlPipelineContext(null);
        htmlContext.setTagFactory(Tags.getHtmlTagProcessorFactory());
        
        ElementList elements = new ElementList();
        ElementHandlerPipeline pdf = new ElementHandlerPipeline(elements, null);
        HtmlPipeline html = new HtmlPipeline(htmlContext, pdf);
        CssResolverPipeline cssResolverPipeline = new CssResolverPipeline(cssResolver, html);
        
        XMLWorker worker = new XMLWorker(cssResolverPipeline,true);
        XMLParser p = new XMLParser(worker);
        p.parse(new ByteArrayInputStream(tableStringBuilder.toString().getBytes()));
        
        return (PdfPTable)elements.get(0);
    }*/
    
    private StringBuilder setPDFRow(Object[] objArr, StringBuilder string){
        string.append("<tr>");
        for(Object obj : objArr){
            string.append("<td>").append(obj.toString()).append("</td>");
        }
        string.append("</tr>");
        return string;
    }
    
   
    
}
