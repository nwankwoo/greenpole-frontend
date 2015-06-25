/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.controller.clientcompany;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.greenpole.controller.holder.HolderController;
import org.greenpole.entity.model.Carrier;
import org.greenpole.entity.model.clientcompany.BondOffer;
import org.greenpole.entity.model.clientcompany.ClientCompany;
import org.greenpole.entity.model.clientcompany.InitialPublicOffer;
import org.greenpole.entity.model.clientcompany.PrivatePlacement;
import org.greenpole.entity.model.clientcompany.QueryClientCompany;
import org.greenpole.entity.model.clientcompany.ShareQuotation;
import org.greenpole.entity.response.Response;
import org.greenpole.model.profiler.Profiler;
import org.greenpole.model.profiler.RelatedTask;
import org.greenpole.model.profiler.UserProfile;
import org.greenpole.model.profiler.ViewGroup;
import org.greenpole.model.profiler.ViewList;
import org.greenpole.util.DataStore;
import org.greenpole.util.FileConverter;
import org.greenpole.util.ServiceEngine;
import org.greenpole.util.Utility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm) 
 */
@Controller
public class ClientCompanyController {
    
    @Autowired
    ServletContext context;
    
    /**
     * Creates a new client company
     * @param clientCompany
     * @param key
     * @param hole
     * @param util
     * @param session
     * @param serviceEngine
     * @return 
     */
     @RequestMapping(value={"createClientCompany"},method=RequestMethod.POST)
    public @ResponseBody Map createNewClientCompany(@ModelAttribute ClientCompany clientCompany,
            @RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            ServiceEngine serviceEngine){
        Map serverResponse= new HashMap();
        try{
           if(util.validateViewMapping(key, hole, "createClientCompany", session))  {
               System.out.println(util.convertObjectToJSONString(clientCompany));
                Response response = serviceEngine.sendClientCompanyRequests(session, clientCompany, ServiceEngine.CREATE_CLIENT_COMPANY);
                serverResponse.put("responseCode", response.getRetn());
                serverResponse.put("description", response.getDesc());
            } 
        }catch(IOException ex){
            ex.printStackTrace();
            
        }
        
        return serverResponse;
    }
    
    @RequestMapping(value={"editClientCompany"},method=RequestMethod.POST)
    public @ResponseBody Map editClientCompany(@ModelAttribute ClientCompany clientCompany,
            @RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            ServiceEngine serviceEngine,DataStore dataStore){
        Map serverResponse= new HashMap();
        try{
           //if(util.validateViewMapping(key, hole, "createClientCompany", session))  {
            System.out.println(util.convertObjectToJSONString(clientCompany));
                ClientCompany cc = (ClientCompany) dataStore.getObject("clientCompany", session);
                clientCompany.setId(cc.getId());
                System.out.println(util.convertObjectToJSONString(clientCompany));
                Response response = serviceEngine.sendClientCompanyRequests(session, clientCompany, ServiceEngine.EDIT_CLIENT_COMPANY);
                //serverResponse="New client company created successfully.";
                serverResponse.put("responseCode", response.getRetn());
                serverResponse.put("description", response.getDesc());
           // } 
        }catch(IOException ex){
            ex.printStackTrace();
            //serverResponse="Encountered error while trying to edit client company.";
        }
        
        return serverResponse;
    }
    
    @RequestMapping(value={"queryClientCompany"},method=RequestMethod.POST)
    public @ResponseBody String queryClientCompany(@ModelAttribute QueryClientCompany queryClientCompany,
            @RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            ServiceEngine serviceEngine) throws NoSuchMethodException, IllegalAccessException, IllegalArgumentException, InvocationTargetException{
        String serverResponse="";
        List <ClientCompany> clientCompanies = new ArrayList();
        DataStore dataStore = null;
        
        try{
            
           if(util.validateViewMapping(key, hole, "queryClientCompany", session))  {
               String descriptor = queryClientCompany.getDescriptor();
               System.out.println(descriptor);
               descriptor = descriptor.replaceAll("\\\"", "");
               System.out.println(descriptor);
               queryClientCompany.setDescriptor(descriptor);
               QueryClientCompany qcc = queryClientCompany;
               System.out.println(util.convertObjectToJSONString(queryClientCompany));
               ClientCompany cc = queryClientCompany.getClientCompany();
               if (cc!=null){
               ObjectMapper mapper = new ObjectMapper();
               mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
               Map <String,Object> ccMap = mapper.readValue(util.convertObjectToJSONString(cc), Map.class);
               Iterator it = ccMap.entrySet().iterator();
               Map <String, Object> newClientCompanyMap = new HashMap();
               while(it.hasNext()){
                   Map.Entry pair = (Map.Entry) it.next();
                   
                   if(pair.getValue()!=null){
                       if(pair.getValue().getClass() == String.class ){
                            newClientCompanyMap.put((String) pair.getKey(), "%"+((String) pair.getValue())+"%");
                       }
                       else if (pair.getValue().getClass() == ArrayList.class){
                           List subList = (List)pair.getValue();
                           newClientCompanyMap.put((String) pair.getKey(), util.appender(subList.get(0)));
                       }
                       else{
                            newClientCompanyMap.put((String) pair.getKey(), (pair.getValue()));
                       }
                   }
                   /*else{
                       newClientCompanyMap.put((String) pair.getKey(), (pair.getValue()));
                   }*/
               }
              
               
               cc = mapper.convertValue(newClientCompanyMap, ClientCompany.class);
               qcc.setClientCompany(cc);
               System.out.println(util.convertObjectToJSONString(qcc));
               }
                Response response = serviceEngine.sendClientCompanyRequests(session, qcc,ServiceEngine.QUERY_CLIENT_COMPANY);
               
                System.out.println(response.getDesc());
                clientCompanies = (List <ClientCompany>) response.getBody();
                dataStore = new DataStore();
                if(clientCompanies!=null && clientCompanies.size()>0){
                    serverResponse = "1";
                }
                else{
                     serverResponse = "0";
                }
                dataStore.saveObject("clientCompanies", clientCompanies, session);
                        //response.getDesc();
            } 
        }catch(IOException ex){
            ex.printStackTrace();
            serverResponse="Encountered error while trying to query client company.";
        }
        
        
        return serverResponse;
        
    }
    
    @RequestMapping(value={"setupBondOffer"},method=RequestMethod.POST)
    public @ResponseBody Map setupBondOffer(@ModelAttribute BondOffer bondOffer,
            @RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            ServiceEngine serviceEngine,DataStore dataStore){
        Map serverResponse= new HashMap();
        System.out.println("Setting up Bond Offer");
        try{
           //if(util.validateViewMapping(key, hole, "setupBondOffer", session))  {
               ClientCompany cc = (ClientCompany) dataStore.getObject("clientCompany", session);
               
               bondOffer.setClientCompanyId(cc.getId());
               bondOffer.setClientCompanyName(cc.getName());
               System.out.println(util.convertObjectToJSONString(bondOffer));
                Response response = serviceEngine.sendClientCompanyRequests(session, bondOffer, ServiceEngine.SETUP_BOND_OFFER);
                //System.out.println(util.convertObjectToJSONString(bondOffer));
               // System.out.println(response.getDesc());
               // serverResponse="Bond Offer Setup successfully.";
               // serverResponse = response.getDesc();
                serverResponse.put("responseCode", response.getRetn());
                serverResponse.put("description", response.getDesc());
           // } 
        }catch(IOException ex){
            ex.printStackTrace();
           //serverResponse="Encountered error while trying to setup bond offer.";
        }
        
        return serverResponse;
        
    }
    
    
    
    @RequestMapping(value={"setupInitialPublicOffer"},method=RequestMethod.POST)
    public @ResponseBody Map setupInitialPublicOffer(@ModelAttribute InitialPublicOffer initialPublicOffer,
            @RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            ServiceEngine serviceEngine,DataStore dataStore){
        Map serverResponse = new HashMap();
        try{
          // if(util.validateViewMapping(key, hole, "setupInitialPublicOffer", session))  {
             ClientCompany cc = (ClientCompany) dataStore.getObject("clientCompany", session);
               System.out.println(util.convertObjectToJSONString(cc));
               initialPublicOffer.setClientCompanyId(cc.getId());
               initialPublicOffer.setClientCompanyName(cc.getName());
                Response response = serviceEngine.sendClientCompanyRequests(session, initialPublicOffer, ServiceEngine.SETUP_INITIAL_PUBLIC_OFFER);
                System.out.println(util.convertObjectToJSONString(initialPublicOffer));
                //serverResponse="Initial Public Offer Setup successfully.";
                //serverResponse = response.getDesc();
                serverResponse.put("responseCode", response.getRetn());
                serverResponse.put("description", response.getDesc());
           // } 
        }catch(IOException ex){
            ex.printStackTrace();
            //serverResponse="Encountered error while trying to setup Initial Public Offer.";
        }
        
        return serverResponse;
        
    }
    
    
    @RequestMapping(value={"setupPrivatePlacement"},method=RequestMethod.POST)
    public @ResponseBody Map setupPrivatePlacement(@ModelAttribute PrivatePlacement privatePlacement,
            @RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            ServiceEngine serviceEngine,DataStore dataStore){
        Map serverResponse = new HashMap();
        try{
          // if(util.validateViewMapping(key, hole, "setupPrivatePlacement", session))  {
                 ClientCompany cc = (ClientCompany) dataStore.getObject("clientCompany", session);
               System.out.println(util.convertObjectToJSONString(cc));
               privatePlacement.setClientCompanyId(cc.getId());
               privatePlacement.setClientCompanyName(cc.getName());
                Response response = serviceEngine.sendClientCompanyRequests(session, privatePlacement, ServiceEngine.SETUP_PRIVATE_PLACEMENT);
                System.out.println(util.convertObjectToJSONString(privatePlacement));
                serverResponse.put("responseCode", response.getRetn());
                serverResponse.put("description", response.getDesc());
                //serverResponse="Private Placement Setup successfully.";
                //serverResponse = response.getDesc();
           // } 
        }catch(IOException ex){
            ex.printStackTrace();
            //serverResponse="Encountered error while trying to setup private placement.";
        }
        
        return serverResponse;
        
    }
    
    @RequestMapping(value={"getShareUnitQuotation"},method=RequestMethod.GET)
    private @ResponseBody List getShareUnitQuotation(@RequestParam (value="pageSize",required=true ) int pageSize,
           @RequestParam (value="page",required=false ) Object page,
           ServiceEngine serviceEngine,HttpSession session) throws MalformedURLException{
        
        DataStore dataStore = new DataStore();
       List <ShareQuotation> shareQuotationList = (List <ShareQuotation>) dataStore.getObject("shareunitquotation", session);
       if(shareQuotationList==null || shareQuotationList.size()<=0){
        Response response = serviceEngine.sendClientCompanyRequests(session, null, ServiceEngine.GET_SHARE_UNIT_QUOTATION);
        shareQuotationList = (List <ShareQuotation>) response.getBody();
        dataStore.saveObject("shareunitquotation", shareQuotationList, session);
       }
       dataStore.getObject("shareunitquotation", session);
        
        return dataStore.getDataSegment(pageSize, page, shareQuotationList);
    }
    
    
    @RequestMapping(value={"printShareQuotation"},method=RequestMethod.GET)
    public String printShareQuotation(){
        return "Client_Company/printShareUnitQuotation";
         
     }
    
     @RequestMapping(value={"/exportShareQuotation"},method=RequestMethod.GET)
     public ModelAndView exportShareQuotation(@RequestParam (value="mode",required=true ) String mode,
             HttpSession httpSession,Utility util,HttpServletResponse serverResponse,HttpServletRequest request) throws IOException{
         System.out.println("mode="+mode);
        List shareUnitData = util.extractShareUnitQuotation(httpSession);
        Map <String,String> header = new HashMap();
        header.put("1", "SN");
        header.put("2", "Client Company");
        header.put("3", "Company Code");
        header.put("4", "Share Unit Price");
        Map <String,Object[]> content = (Map <String,Object[]>) shareUnitData.get(1);
        byte [] exportedData = null;
        try {
           if(mode.equalsIgnoreCase("MSExcel")){
               exportedData = new FileConverter().exportData(header,content,"Share Unit Quotation Report", FileConverter.MS_EXCEL);
                serverResponse.setContentType("application/vnd.ms-excel");
        serverResponse.setHeader("Content-Disposition","inline; filename=Share Unit Quotation.xlsx");
        serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
           if(mode.equalsIgnoreCase("PDF")){
             System.out.println(mode);
               exportedData = new FileConverter().exportData(header,content,"Share Unit Quotation Report", FileConverter.PDF);
                serverResponse.setContentType("application/pdf");
                serverResponse.setHeader("Content-Disposition","inline; filename=Share Unit Quotation.pdf");
                serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
           
           if(mode.equalsIgnoreCase("CSV")){
             System.out.println(mode);
               exportedData = new FileConverter().exportData(header,content,"Share Unit Quotation Report", FileConverter.CSV);
                serverResponse.setContentType("text/csv");
                serverResponse.setHeader("Content-Disposition","inline; filename=Share Unit Quotation.csv");
                serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
            
        } catch (Exception ex) {
            Logger.getLogger(HolderController.class.getName()).log(Level.SEVERE, null, ex);
        } 
       
        
        System.out.println("exporting");
        return null;
     }
     
     
     @RequestMapping(value={"uploadShareUnitQuotation"},method=RequestMethod.POST)
     public @ResponseBody Map uploadShareUnitQuotation(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            @RequestParam("shareUnitQuotation") MultipartFile shareUnitQuotation,ServiceEngine serviceEngine){
         Map serverResponse = new HashMap();
         List <ShareQuotation> shareQuotationList = new ArrayList();
         try{
           if(util.validateViewMapping(key, hole, "uploadShareUnitQuotation", session))  {
                if(!shareUnitQuotation.isEmpty()){
                    byte[] shareUnitQuotationFileByte = shareUnitQuotation.getBytes();
                    File dir = new File("C:\\tmpFiles");
                    if(!dir.exists())
                        dir.mkdir();
                    String csvSavePath=dir.getAbsoluteFile() + File.separator + new Profiler().getKey(12)+".csv";
                    FileOutputStream stream=new FileOutputStream(csvSavePath);                    
                    stream.write(shareUnitQuotationFileByte);
                    stream.close();
                    BufferedReader csvFileReader = new BufferedReader( new FileReader(csvSavePath));
                    
                    String csvline="";
                    
                    while((csvline = csvFileReader.readLine()) != null){
                        String quotation[] = csvline.split(",");
                        shareQuotationList.add(
                                new ShareQuotation(
                                        new ClientCompany(quotation[1]),
                                        Double.parseDouble(quotation[2]
                                        )
                                )
                        );
                    }
                    Carrier carrier = new Carrier();
                    carrier.setCarriedList(shareQuotationList);
                    Response response = serviceEngine.sendClientCompanyRequests(session, carrier, ServiceEngine.UPLOAD_SHARE_UNIT_QUOTATION);
                    System.out.println(util.convertObjectToJSONString(shareQuotationList));
                    //serverResponse="File Uploaded";
                    //serverResponse = response.getDesc();
                    serverResponse.put("responseCode", response.getRetn());
                serverResponse.put("description", response.getDesc());
                }
            } 
        }catch(IOException ex){
            ex.printStackTrace();
           // serverResponse="Encountered error while processing file. Please make sure the file is properly formated";
        }
         return serverResponse;
     }
     
     @RequestMapping(value={"getClientCompanyList"}, method = RequestMethod.GET)
     public @ResponseBody List getClientCompanyList(@RequestParam (value="pageSize",required=true ) Object pageSize,
           @RequestParam (value="page",required=false ) Object page, HttpSession httpSession){
         DataStore dataStore = new DataStore();
        List <ClientCompany> clientCompanyObject = (List <ClientCompany>) dataStore.getObject("clientCompanies",httpSession);       
   
        return dataStore.getDataSegment(pageSize, page, clientCompanyObject);
     }
     
     @RequestMapping(value={"printClientCompany"},method=RequestMethod.GET)
    public String printSClientCompany(){
        return "Client_Company/printClientCompany";
         
     }
     
      @RequestMapping(value={"/exportClientCompany"},method=RequestMethod.GET)
     public ModelAndView exportClientCompany(@RequestParam (value="mode",required=true ) String mode,
             HttpSession httpSession,Utility util,HttpServletResponse serverResponse,HttpServletRequest request) throws IOException{
         System.out.println("mode="+mode);
        List clientCompanyData = util.extractClientCompanyData(httpSession);
        Map <String,String> header = new HashMap();
        header.put("1", "Company Code");
        header.put("2", "Company Name");
        header.put("3", "Address");
        header.put("4", "Depository");
        header.put("5", "Email Address");
        header.put("6", "No. of Shareholders");
        header.put("7", "No. of Bondholders");
        header.put("8", "Share Unit Price");
        Map <String,Object[]> content = (Map <String,Object[]>) clientCompanyData.get(1);
        byte [] exportedData = null;
        try {
           if(mode.equalsIgnoreCase("MSExcel")){
               exportedData = new FileConverter().exportData(header,content,"Client Company Report", FileConverter.MS_EXCEL);
                serverResponse.setContentType("application/vnd.ms-excel");
        serverResponse.setHeader("Content-Disposition","inline; filename=Client Company Report.xlsx");
        serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
           if(mode.equalsIgnoreCase("PDF")){
             System.out.println(mode);
               exportedData = new FileConverter().exportData(header,content,"Client Company Report", FileConverter.PDF);
                serverResponse.setContentType("application/pdf");
                serverResponse.setHeader("Content-Disposition","inline; filename=Client Company Report.pdf");
                serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
           
           if(mode.equalsIgnoreCase("CSV")){
             System.out.println(mode);
               exportedData = new FileConverter().exportData(header,content,"Client Company Report", FileConverter.CSV);
                serverResponse.setContentType("text/csv");
                serverResponse.setHeader("Content-Disposition","inline; filename=Client Company Report.csv");
                serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
            
        } catch (Exception ex) {
            Logger.getLogger(HolderController.class.getName()).log(Level.SEVERE, null, ex);
        } 
       
        
        System.out.println("exporting");
        return null;
     }
     
     @RequestMapping(value={"getClientCompanyDetails/{id}/{name}"}, method = RequestMethod.GET)
     public ModelAndView getDetails(@PathVariable ("id") String id, @PathVariable ("name") String name,
             DataStore dataStore, HttpSession httpSession,Utility util) throws IOException{
         ModelAndView mv = new ModelAndView();
         ClientCompany clientCompany = null;
         List <ClientCompany> clientCompanies = (List <ClientCompany>) dataStore.getObject("clientCompanies", httpSession);
         for(ClientCompany cc : clientCompanies){
             if(id.equals(cc.getId()+"") && name.equals(cc.getName())){
                 clientCompany = cc;
                 break;
             }
         }
         
         if(clientCompany!= null){
             System.out.println(util.convertObjectToJSONString(clientCompany));
             UserProfile profile = (UserProfile) httpSession.getAttribute("userprofile");
             dataStore.saveObject("clientCompany", clientCompany, httpSession);
             Map <String,ViewGroup> ViewGroups = profile.getViews();
             Map<String,RelatedTask> relatedTask = null;
             String hole = "";
             Iterator it = ViewGroups.entrySet().iterator();
             
               while(it.hasNext()){
                   Map.Entry pair = (Map.Entry) it.next();
                   ViewGroup viewGroup = (ViewGroup) pair.getValue();
                   Map <String, ViewList> viewLists = viewGroup.getViewList();
                   Iterator viewListIterator = viewLists.entrySet().iterator();
                   while(viewListIterator.hasNext()){
                       Map.Entry viewListPair = (Map.Entry) viewListIterator.next();
                       ViewList viewList = (ViewList)viewListPair.getValue();
                       if(viewList.getViewName().equals("createClientCompany")){
                           relatedTask = viewList.getRelatedTaskList();
                           hole = (String) viewListPair.getKey();
                       }
                   }
                   
               }
             if(relatedTask!=null){
                 mv.addObject("relatedTask", relatedTask);
             }
             mv.addObject("appendageUrl","../../relatedtask/clientCompany?hole="+hole+"&id="+id);
             mv.addObject("clientCompany", clientCompany);
         }
         
         mv.setViewName("viewDetails/ClientCompany");
         return mv;
     }
     
     @RequestMapping(value = {"relatedtask/clientCompany"}, method = RequestMethod.GET)
     public ModelAndView relatedTask(@RequestParam (value="hole", required = true) String hole,
             @RequestParam (value="id", required = true) String id, @RequestParam(value="key", required = true) String key,
             HttpSession httpSession, DataStore dataStore,Utility util) throws MalformedURLException, URISyntaxException, ClassNotFoundException, InstantiationException, IllegalAccessException, IOException{
         ModelAndView mv = new ModelAndView();
         
         UserProfile userprofile = (UserProfile) httpSession.getAttribute("userprofile");
         
          Map <String,ViewGroup> ViewGroups = userprofile.getViews();
          Iterator it = ViewGroups.entrySet().iterator();
          while(it.hasNext()){
             Map.Entry pair = (Map.Entry) it.next();
             ViewGroup viewGroup = (ViewGroup) pair.getValue();
             Map <String, ViewList> viewLists = viewGroup.getViewList();
             Iterator viewListIterator = viewLists.entrySet().iterator();
              while(viewListIterator.hasNext()){
                    Map.Entry viewListPair = (Map.Entry) viewListIterator.next();
                    ViewList viewList = (ViewList)viewListPair.getValue();
                    
                    if(viewListPair.getKey().toString().equals(hole)){
                        
                        Map<String,RelatedTask> relatedTaskMap = viewList.getRelatedTaskList();
                        Iterator relatedTaskIterator = relatedTaskMap.entrySet().iterator();
                        while(relatedTaskIterator.hasNext()){
                            
                            Map.Entry relatedTaskPair = (Map.Entry) relatedTaskIterator.next();
                            if(relatedTaskPair.getKey().toString().equals(key)){                             
                                RelatedTask relatedTask = (RelatedTask) relatedTaskPair.getValue();
                                String viewname = relatedTask.getTaskViewName();
                                String viewtitle=relatedTask.getTaskName();  
                                String viewModel=relatedTask.getTaskModel();
                                mv.addObject("viewtitle",viewtitle);
                                URI startURI=new URI(context.getResource("/WEB-INF/viewList/").toString());
                                String view=util.lookUpView(viewname,startURI,".html",false);
                                if (view!=null && !view.equals("")){
                                  
                                    Class model;
                                    if(!viewModel.isEmpty()){
                                        model=Class.forName(viewModel);
                                        mv.addObject(viewname,model.newInstance());
                                        mv.addObject("clientCompany", dataStore.getObject("clientCompany", httpSession));
                                    }
                                    else if(viewname.equals("editClientCompany")){
                                        System.out.println(util.convertObjectToJSONString(dataStore.getObject("clientCompany", httpSession)));
                                        mv.addObject("clientCompany", dataStore.getObject("clientCompany", httpSession));
                                    }

                                    mv.setViewName(view);
                                    String formAction=viewname.concat("?key=").concat(key).concat("&hole=").concat(hole);
                                    mv.addObject("formAction", formAction);
                                }
                                else{
                                    mv.setViewName("404");
                                } 
                            }
                        }
                    }
                }
          }
         return mv;
     }
}
