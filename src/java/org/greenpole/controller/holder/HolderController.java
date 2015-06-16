/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.controller.holder;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.TypeFactory;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.greenpole.entity.model.clientcompany.UnitTransfer;
import org.greenpole.entity.model.holder.Administrator;
import org.greenpole.entity.model.holder.Holder;
import org.greenpole.entity.model.holder.HolderMerger;
import org.greenpole.entity.model.holder.PowerOfAttorney;
import org.greenpole.entity.model.holder.QueryHolder;
import org.greenpole.entity.model.holder.HolderSignature;
import org.greenpole.entity.response.Response;
import org.greenpole.model.profiler.RelatedTask;
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
public class HolderController {
    
     @Autowired
    ServletContext context;
     
    @RequestMapping(value={"createShareholderAccount"},method=RequestMethod.POST)
    public @ResponseBody String createShareHolder(@ModelAttribute Holder holder,@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            ServiceEngine serviceEngine){
        String serverResponse="";
        try{
            System.out.println("createShareholderAccount");
           if(util.validateViewMapping(key, hole, "createShareholderAccount", session))  {
               System.out.println(util.convertObjectToJSONString(holder));
               Response response = serviceEngine.sendHolderRequest(session, holder, ServiceEngine.CREATE_SHAREHOLDER_ACCOUNT);
                //serverResponse="Shareholder Account created successfully.";
               serverResponse = response.getDesc();
           }
         }catch(Exception ex){
              ex.printStackTrace();
            serverResponse="Encountered error while trying to create shareholder Account.";
         }
     return serverResponse;
    }
    
    
    @RequestMapping(value={"createBondholderAccount"},method=RequestMethod.POST)
    public @ResponseBody String createBondholderAccount(@ModelAttribute Holder holder,@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            ServiceEngine serviceEngine){
        String serverResponse="";
        try{
            System.out.println("createBondholderAccount");
           if(util.validateViewMapping(key, hole, "createBondholderAccount", session))  {
               System.out.println(util.convertObjectToJSONString(holder));
               Response response = serviceEngine.sendHolderRequest(session, holder, ServiceEngine.CREATE_BONDHOLDER_ACCOUNT);
                //serverResponse="Bondholder Account created successfully.";
               serverResponse = response.getDesc();
           }
         }catch(Exception ex){
              ex.printStackTrace();
            serverResponse="Encountered error while trying to create shareholder Account.";
         }
     return serverResponse;
    }
    
     
    
    @RequestMapping(value={"uploadHolderSignature"},method=RequestMethod.POST)
     public @ResponseBody String uploadShareUnitQuotation(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            @RequestParam("holderSignature") MultipartFile holderSignature,HolderSignature signature,
            ServiceEngine serviceEngine,DataStore dataStore){
         String serverResponse="";
         System.out.println("uploading signature");
         try{
           //if(util.validateViewMapping(key, hole, "uploadHolderSignature", session))  {
                if(!holderSignature.isEmpty()){
                    Holder holder = (Holder) dataStore.getObject("holder", session);
                    byte[] holderSignatureByte = holderSignature.getBytes();
                    //holderSignatureByte
                    signature.setHolderId(holder.getHolderId());
                    signature.setSignatureContent(Base64.getEncoder().encodeToString(holderSignatureByte));
                    System.out.println(util.convertObjectToJSONString(signature));
                    Response response = serviceEngine.sendHolderRequest(session, signature, ServiceEngine.UPLOAD_HOLDER_SIGNATURE);
                    serverResponse=response.getDesc();
                    
                }
           // } 
        }catch(IOException ex){
            ex.printStackTrace();
            serverResponse="Encountered error while processing file. Please make sure the file is properly formated";
        }
         return serverResponse;
     }
    // ,method=RequestMethod.POST,consumes=MediaType.APPLICATION_JSON_VALUE,produces=MediaType.APPLICATION_JSON_VALUE
     @RequestMapping(value={"createAdministrator"},method=RequestMethod.POST)
     public @ResponseBody String createAdministrator(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,HttpServletRequest request,
            ServiceEngine serviceEngine,DataStore dataStore){
         String serverResponse="";
         System.out.println("creating administrator plsease wait");
         try{
           //  if(util.validateViewMapping(key, hole, "createAdministrator", session))  {
                 ObjectMapper mapper = new ObjectMapper();
                 Holder sessionHolder = (Holder) dataStore.getObject("holder",session);
                 String admins= (request.getParameter("administrators"));
                 //admins = admins.replace('on', 'true');
                 System.out.println(admins);
                 //byte [] jsonData = admins.getBytes();
                 TypeFactory typeFactory = mapper.getTypeFactory();
                 List <Administrator> administrators = mapper.readValue(admins,typeFactory.constructCollectionType(List.class, Administrator.class));
                 for(Administrator administrator : administrators){
                     if(administrator.getPryAddress().equals("residential") && administrator.getPostalAddress().getAddressLine1().isEmpty()){
                         administrator.setPostalAddress(null);
                     }
                     else if(administrator.getPryAddress().equals("postal") && administrator.getResidentialAddress().getAddressLine1().isEmpty()){
                         administrator.setResidentialAddress(null);
                     }
                 }
                 sessionHolder.setAdministrators(administrators);
                 System.out.println(util.convertObjectToJSONString(sessionHolder));
                 Response response = serviceEngine.sendHolderRequest(session, sessionHolder, ServiceEngine.CREATE_ADMINISTRATOR);
                 //serverResponse="Administrator Created";
                 serverResponse = response.getDesc();
           // } 
         }
         catch(Exception ex){
             ex.printStackTrace();
         }
         System.out.println(serverResponse);
         return serverResponse;
     }
     
     
     @RequestMapping(value={"uploadPowerofAttorney"},method=RequestMethod.POST)
     public @ResponseBody String uploadPowerofAttorney(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,
            @RequestParam("powerofAttorneyFile") MultipartFile powerofAttorneyFile,PowerOfAttorney powerofAttorney,
            ServiceEngine serviceEngine,DataStore dataStore){
         String serverResponse="";
         System.out.println("uploading power of attorney");
         try{
           //if(util.validateViewMapping(key, hole, "uploadPowerofAttorney", session))  {
                if(!powerofAttorneyFile.isEmpty()){
                    Holder holder = (Holder) dataStore.getObject("holder", session);
                    byte[] powerofAttorneyByte = powerofAttorneyFile.getBytes();
                    String filename = powerofAttorneyFile.getOriginalFilename();
                    String uri = util.getURI(filename)+Base64.getUrlEncoder().encodeToString(powerofAttorneyByte);
                    System.out.println(powerofAttorneyFile.getOriginalFilename());
                    //powerofAttorneyByte
                    powerofAttorney.setHolderId(holder.getHolderId());
                    powerofAttorney.setFileContents(Base64.getEncoder().encodeToString(powerofAttorneyByte));
                    System.out.println(util.convertObjectToJSONString(powerofAttorney));
                    Response response = serviceEngine.sendHolderRequest(session, powerofAttorney, ServiceEngine.UPLOAD_POWER_OF_ATTORNEY);
                   // serverResponse="Power of Attorney Uploaded Successfully";
                    serverResponse = response.getDesc();
                    
                }
           // } 
        }catch(IOException ex){
            ex.printStackTrace();
            serverResponse="Encountered error while processing file. Please make sure the file is properly formated";
        }
         return serverResponse;
     }
     
      @RequestMapping(value={"transposeHolderName"},method=RequestMethod.POST)
      public @ResponseBody String transposeHolderName (@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,HttpServletRequest request,
            ServiceEngine serviceEngine,DataStore dataStore){
         String serverResponse="";
         try{
           //if(util.validateViewMapping(key, hole, "transposeHolderName", session))  {
               ObjectMapper mapper = new ObjectMapper();
                 
                 String holderJSON = (request.getParameter("holder"));
                 System.out.println(holderJSON);
                 byte [] jsonData = holderJSON.getBytes();
                 Holder requestholder = mapper.readValue(jsonData,Holder.class );
                 Holder holder = (Holder) dataStore.getObject("holder", session);
                 holder.setFirstName(requestholder.getFirstName());
                 holder.setMiddleName(requestholder.getMiddleName());
                 holder.setLastName(requestholder.getLastName());
                 System.out.println(util.convertObjectToJSONString(holder));
                 Response response = serviceEngine.sendHolderRequest(session, holder, ServiceEngine.TRANSPOSE_HOLDER_NAME);
                 //serverResponse="Holder name transposed successfully";
                 serverResponse = response.getDesc();
                 /*Holder transposeHolder = new Holder();
                 transposeHolder.setFirstName(serverResponse);
                 transposeHolder.setMiddleName(hole);
                 transposeHolder.setLastName(serverResponse);*/
         //  }
         }
         catch(Exception ex){
             ex.printStackTrace();
         }
         
         return serverResponse;
     }
      
      @RequestMapping(value={"queryShareholderAccount"},method=RequestMethod.POST)
      public @ResponseBody String queryShareholderAccount(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,@RequestParam(value="mode",required=false) String mode,Utility util, HttpSession session,QueryHolder queryHolder,
            ServiceEngine serviceEngine,DataStore dataStore){
          String serverResponse="";
          try{
              if(util.validateViewMapping(key, hole, "queryShareholderAccount", session))  {
                  QueryHolder qh = queryHolder;
                  Holder holder = queryHolder.getHolder();
                   System.out.println(util.convertObjectToJSONString(queryHolder));
                  
                  if(holder!=null){
                      ObjectMapper mapper = new ObjectMapper();
               mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
               Map <String,Object> ccMap = mapper.readValue(util.convertObjectToJSONString(holder), Map.class);
               Iterator it = ccMap.entrySet().iterator();
               Map <String, Object> newHolderMap = new HashMap();
               while(it.hasNext()){
                   Map.Entry pair = (Map.Entry) it.next();
                   if(pair.getValue()!=null){
                       if (((String)pair.getKey()).equals("dob")){
                           continue;
                       }
                       else if(pair.getValue().getClass() == String.class ){
                            newHolderMap.put((String) pair.getKey(), "%"+((String) pair.getValue())+"%");
                       }
                       else if (pair.getValue().getClass() == ArrayList.class){
                           List subList = (List)pair.getValue();
                           newHolderMap.put((String) pair.getKey(), util.appender(subList.get(0)));
                       }
                       
                       else{
                            newHolderMap.put((String) pair.getKey(), (pair.getValue()));
                       }
                   }
               }
               holder = mapper.convertValue(newHolderMap, Holder.class);
               qh.setHolder(holder);
               qh.setIsShareHolder(true);
                System.out.println(util.convertObjectToJSONString(qh));
                  }
                   List<Holder> holderList = new ArrayList();
                   int code = 0;
                   
                   /*if(mode.equals("regular")){
                       code = ServiceEngine.QUERY_SHAREHOLDER_ACCOUNT;
                       key = "shareholderList";
                   }
                   else if(mode.equals("all")){
                       code = ServiceEngine.QUERY_ALL_SHARE_HOLDER_ACCOUNT;
                       key = "allShareholderList";
                   }*/
                   Response response = serviceEngine.sendHolderRequest(session, qh, ServiceEngine.QUERY_SHAREHOLDER_ACCOUNT);
                   System.out.println(response.getDesc());
                   holderList = (List <Holder>) response.getBody();
                   System.out.println(util.convertObjectToJSONString(holderList));
                dataStore = new DataStore();
                if(holderList!=null && holderList.size()>0){
                    serverResponse = "1";
                }
                else{
                     serverResponse = "0";
                }
                
                dataStore.saveObject("shareholderList", holderList, session);

                  
              }
          }catch(Exception ex){
              ex.printStackTrace();
              
          }
         
          return serverResponse;
      }
      
      @RequestMapping(value={"getShareholders"},method=RequestMethod.GET)
    public @ResponseBody List getShareholder(@RequestParam (value="pageSize",required=true ) Object pageSize,
           @RequestParam (value="page",required=false ) Object page,  HttpSession httpSession){
        //@RequestParam(value="mode",required=true) String mode,
        DataStore dataStore = new DataStore();
        String key = "";
        /*if(mode.equals("regular")){
                       key = "shareholderList";
        }
        else if(mode.equals("all")){
            key = "allShareholderList";
        }*/
        List <Holder> holderObject = (List <Holder>) dataStore.getObject("shareholderList",httpSession);
        return dataStore.getDataSegment(pageSize, page, holderObject);
    }
    
     @RequestMapping(value={"getBondholders"},method=RequestMethod.GET)
    public @ResponseBody List getBondholder(@RequestParam (value="pageSize",required=true ) Object pageSize,
           @RequestParam (value="page",required=false ) Object page, HttpSession httpSession){
        
        DataStore dataStore = new DataStore();
        List <Holder> holderObject = (List <Holder>) dataStore.getObject("bondholderList",httpSession);
        System.out.println("holder object="+holderObject);
      
       
   
        return dataStore.getDataSegment(pageSize, page, holderObject);
    }
    
      @RequestMapping(value={"queryBondholderAccount"},method=RequestMethod.POST)
      public @ResponseBody String queryBondholderAccount(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,QueryHolder queryHolder,
            ServiceEngine serviceEngine,DataStore dataStore){
          String serverResponse="";
          try{
              if(util.validateViewMapping(key, hole, "queryBondholderAccount", session))  {
                  System.out.println(util.convertObjectToJSONString(queryHolder));
                  QueryHolder qh = queryHolder;
                  Holder holder = queryHolder.getHolder();
                 /* if(holder.getFirstName()!=null){
                      holder.setMiddleName(holder.getFirstName());
                      holder.setLastName(holder.getFirstName());
                  }*/
                  
                  if(holder!=null){
                      ObjectMapper mapper = new ObjectMapper();
               mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
               Map <String,Object> ccMap = mapper.readValue(util.convertObjectToJSONString(holder), Map.class);
               Iterator it = ccMap.entrySet().iterator();
               Map <String, Object> newHolderMap = new HashMap();
               while(it.hasNext()){
                   Map.Entry pair = (Map.Entry) it.next();
                   if(pair.getValue()!=null){
                       if (((String)pair.getKey()).equals("dob")){
                           continue;
                       }
                       
                       else if(pair.getValue().getClass() == String.class ){
                            newHolderMap.put((String) pair.getKey(), "%"+((String) pair.getValue())+"%");
                       }
                       else if (pair.getValue().getClass() == ArrayList.class){
                           List subList = (List)pair.getValue();
                           newHolderMap.put((String) pair.getKey(), util.appender(subList.get(0)));
                       }
                       
                       else{
                            newHolderMap.put((String) pair.getKey(), (pair.getValue()));
                       }
                   }
               }
               holder = mapper.convertValue(newHolderMap, Holder.class);
               
               qh.setHolder(holder);
               qh.setIsShareHolder(false);
               System.out.println(util.convertObjectToJSONString(qh));
                  }
                   
                   Response response = serviceEngine.sendHolderRequest(session, qh, ServiceEngine.QUERY_BOND_HOLDER);
                   //serverResponse="Query Completed";
                   System.out.println(response.getDesc());
                    List<Holder> holderList = new ArrayList();
                  
                   System.out.println(response.getDesc());
                   holderList = (List <Holder>) response.getBody();
                   System.out.println(holderList);
                dataStore = new DataStore();
                if(holderList!=null && holderList.size()>0){
                    serverResponse = "1";
                    dataStore.saveObject("bondholderList", holderList, session);
                }
                else{
                     serverResponse = "0";
                }
                
                  // serverResponse = response.getDesc();
              }
          }catch(Exception ex){
              ex.printStackTrace();
              
          }
         
          return serverResponse;
      }
      
      @RequestMapping(value={"mergeShareholderAccount"},method=RequestMethod.POST)
     public @ResponseBody String mergeShareholderAccount(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,HttpServletRequest request,
            ServiceEngine serviceEngine){
         String serverResponse="";
         System.out.println("merging plsease wait");
         try{
             if(util.validateViewMapping(key, hole, "mergeShareholderAccount", session))  {
                 ObjectMapper mapper = new ObjectMapper();
                 
                 String accounts= (request.getParameter("accounts"));
                 System.out.println(accounts);
                 byte [] jsonData = accounts.getBytes();
                 HolderMerger holderMerger = mapper.readValue(jsonData,HolderMerger.class );
                 System.out.println(util.convertObjectToJSONString(holderMerger));
                 Response response = serviceEngine.sendHolderRequest(session, holderMerger, ServiceEngine.MERGE_SHAREHOLDER_ACCOUNT);
                 //serverResponse="Accounts merged successfully";
                 serverResponse = response.getDesc();
            } 
         }
         catch(Exception ex){
             ex.printStackTrace();
         }
         System.out.println(serverResponse);
         return serverResponse;
     }
     
     
       @RequestMapping(value={"deMergeShareholderAccount"},method=RequestMethod.POST)
     public @ResponseBody String deMergeShareholderAccount(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,HttpServletRequest request,
            ServiceEngine serviceEngine){
         String serverResponse="";
         System.out.println("demerging plsease wait");
         try{
             if(util.validateViewMapping(key, hole, "deMergeShareholderAccount", session))  {
                 ObjectMapper mapper = new ObjectMapper();
                 
                 String accountId= (request.getParameter("accountId"));
                 System.out.println("accountsId="+accountId);
                 /*System.out.println(accounts);
                 byte [] jsonData = accounts.getBytes();*/
                 //Holder holder = mapper.readValue(jsonData,Holder.class );
                 HolderMerger holderMerger = new HolderMerger();
                 int holderId = Integer.parseInt(accountId);
                 Holder holder = new Holder();
                 holder.setHolderId(holderId);
                 holderMerger.setPrimaryHolder(holder);
                 System.out.println(util.convertObjectToJSONString(holderMerger));
                 Response response = serviceEngine.sendHolderRequest(session, holderMerger, ServiceEngine.DEMERGE_SHAREHOLDER_ACCOUNT);
                 //serverResponse="Accounts merged successfully";
                 serverResponse = response.getDesc();
            } 
         }
         catch(Exception ex){
             ex.printStackTrace();
         }
         System.out.println(serverResponse);
         return serverResponse;
     }
     
     @RequestMapping(value={"transferShareUnit"},method=RequestMethod.POST)
     public @ResponseBody String transferShareUnit(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,HttpServletRequest request,
            ServiceEngine serviceEngine){
         String serverResponse="";
         System.out.println("transfering share unit please wait");
         try{
             if(util.validateViewMapping(key, hole, "transferShareUnit", session))  {
                 ObjectMapper mapper = new ObjectMapper();
                 
                 String transferDetails= (request.getParameter("transferDetails"));
                 System.out.println(transferDetails);
                 byte [] jsonData = transferDetails.getBytes();
                 UnitTransfer unitTransfer = mapper.readValue(jsonData,UnitTransfer.class );
                 System.out.println(util.convertObjectToJSONString(unitTransfer));
                 Response response = serviceEngine.sendHolderRequest(session, unitTransfer, ServiceEngine.TRANSFER_SHARE_UNIT);
                 serverResponse="Units transfered successfully";
                 serverResponse = response.getDesc();
            } 
         }
         catch(Exception ex){
             ex.printStackTrace();
         }
         System.out.println(serverResponse);
         return serverResponse; 
     }
     
     
     @RequestMapping(value={"transferBondUnit"},method=RequestMethod.POST)
     public @ResponseBody String transferBondUnit(@RequestParam (value="key",required=true ) String key,
            @RequestParam (value="hole",required=true ) String hole,Utility util, HttpSession session,HttpServletRequest request,
            ServiceEngine serviceEngine){
         String serverResponse="";
         System.out.println("transfering bond unit please wait");
         try{
             if(util.validateViewMapping(key, hole, "transferBondUnit", session))  {
                 ObjectMapper mapper = new ObjectMapper();
                 
                 String transferDetails= (request.getParameter("transferDetails"));
                 System.out.println(transferDetails);
                 byte [] jsonData = transferDetails.getBytes();
                 UnitTransfer unitTransfer = mapper.readValue(jsonData,UnitTransfer.class );
                 Response response = serviceEngine.sendHolderRequest(session, unitTransfer, ServiceEngine.TRANSFER_BOND_UNIT);
                 System.out.println(util.convertObjectToJSONString(unitTransfer));
                 //serverResponse="Units transfered successfully";
                 serverResponse = response.getDesc();
            } 
         }
         catch(Exception ex){
             ex.printStackTrace();
         }
         System.out.println(serverResponse);
         return serverResponse; 
     }
     
     @RequestMapping(value={"/printShareholders"},method=RequestMethod.GET)
     public String printShareholders(){
        return "Holder/printShareholders";
         
     }
     
     @RequestMapping(value={"/printBondholders"},method=RequestMethod.GET)
     public String printBondholders(){
        return "Holder/printBondholders";
         
     }
     
      @RequestMapping(value={"/exportShareholderToPDF"},method=RequestMethod.GET)
     public ModelAndView exportShareholderToPDF(DataStore dataStore,HttpSession httpSession,Utility util) throws IOException{
        List shareholderData = util.extractShareholderData(httpSession);
        ModelAndView modelAndView = new ModelAndView();
        Map <String, Object[]> shareholders = (Map <String, Object[]>) shareholderData.get(1);
        shareholders = new TreeMap<String, Object[]>(shareholders);
        modelAndView.addObject("shareholdersList",shareholders );
        modelAndView.addObject("holderJSON",util.convertObjectToJSONString(shareholders));
        modelAndView.setViewName("Holder/exportShareholderToPDF");
        return modelAndView;
         
     }
     
     
     @RequestMapping(value={"/exportShareholders"},method=RequestMethod.GET)
     public ModelAndView exportShareholders(@RequestParam (value="mode",required=true ) String mode,
             HttpSession httpSession,Utility util,HttpServletResponse serverResponse,HttpServletRequest request) throws IOException{
         System.out.println("mode="+mode);
        List shareholderData = util.extractShareholderData(httpSession);
        Map <String,String> header = new HashMap();
        header.put("1", "SN");
        header.put("2", "Holder Name");
        header.put("3", "CHN Number");
        header.put("4", "Email Address(es)");
        header.put("5", "Phone Number(s)");
        header.put("6", "Total Holdings");
        header.put("7", "Holder Type");
        Map <String,Object[]> content = (Map <String,Object[]>) shareholderData.get(1);
        byte [] exportedData = null;
        try {
           if(mode.equalsIgnoreCase("MSExcel")){
               exportedData = new FileConverter().exportData(header,content,"Shareholders Report", FileConverter.MS_EXCEL);
                serverResponse.setContentType("application/vnd.ms-excel");
        serverResponse.setHeader("Content-Disposition","inline; filename=Shareholders_Report.xlsx");
        serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
           if(mode.equalsIgnoreCase("PDF")){
             System.out.println(mode);
               exportedData = new FileConverter().exportData(header,content,"Shareholders Report", FileConverter.PDF);
                serverResponse.setContentType("application/pdf");
                serverResponse.setHeader("Content-Disposition","inline; filename=Shareholders_Report.pdf");
                serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
           
           if(mode.equalsIgnoreCase("CSV")){
             System.out.println(mode);
               exportedData = new FileConverter().exportData(header,content,"Shareholders Report", FileConverter.PDF);
                serverResponse.setContentType("text/csv");
                serverResponse.setHeader("Content-Disposition","inline; filename=Shareholders Report.csv");
                serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
            
        } catch (Exception ex) {
            Logger.getLogger(HolderController.class.getName()).log(Level.SEVERE, null, ex);
        } 
       
        
        System.out.println("exporting");
        return null;
     }
     
     @RequestMapping(value={"/exportBondholders"},method=RequestMethod.GET)
     public ModelAndView exportBondholders(@RequestParam (value="mode",required=true ) String mode,
             HttpSession httpSession,Utility util,HttpServletResponse serverResponse,HttpServletRequest request) throws IOException{
         System.out.println("mode="+mode);
        List bondholderData = util.extractBondholderData(httpSession);
        Map <String,String> header = new HashMap();
        header.put("1", "SN");
        header.put("2", "Holder Name");
        header.put("3", "CHN Number");
        header.put("4", "Address");
        header.put("5", "Phone Number(s)");
        header.put("6", "Total Holdings");
        header.put("7", "Holder Type");
        Map <String,Object[]> content = (Map <String,Object[]>) bondholderData.get(1);
        byte [] exportedData = null;
        try {
           if(mode.equalsIgnoreCase("MSExcel")){
               exportedData = new FileConverter().exportData(header,content,"Bondholders Report", FileConverter.MS_EXCEL);
                serverResponse.setContentType("application/vnd.ms-excel");
        serverResponse.setHeader("Content-Disposition","inline; filename=BondHolders Report.xlsx");
        serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
           if(mode.equalsIgnoreCase("PDF")){
               exportedData = new FileConverter().exportData(header,content,"Bondholders Report", FileConverter.PDF);
                serverResponse.setContentType("application/pdf");
                serverResponse.setHeader("Content-Disposition","inline; filename=Bondholders Report.pdf");
                serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
           if(mode.equalsIgnoreCase("CSV")){
               exportedData = new FileConverter().exportData(header,content,"Bondholders Report", FileConverter.CSV);
                serverResponse.setContentType("text/csv");
                serverResponse.setHeader("Content-Disposition","inline; filename=Bondholders Report.csv");
                serverResponse.getOutputStream().write(exportedData, 0, exportedData.length);
        serverResponse.getOutputStream().flush();
           }
            
        } catch (Exception ex) {
            Logger.getLogger(HolderController.class.getName()).log(Level.SEVERE, null, ex);
        } 
       
        
        System.out.println("exporting");
        return null;
     }
     
     @RequestMapping(value={"getHolderDetails/{holderType}/{id}"}, method = RequestMethod.GET)
     public ModelAndView getDetails(@PathVariable ("holderType") String holderType, @PathVariable ("id") String id,
             DataStore dataStore, HttpSession httpSession,Utility util) throws IOException{
         ModelAndView mv = new ModelAndView();
         List <Holder> holderList = null;
         System.out.println("id="+id);
         if(holderType.equals("shareholder")){
             holderList = (List <Holder>) dataStore.getObject("shareholderList", httpSession);
             mv.setViewName("viewDetails/shareholder");
         }
         else if(holderType.equals("bondholder")){
              holderList = (List <Holder>) dataStore.getObject("bondholderList", httpSession);
              mv.setViewName("viewDetails/Holder");
         }
         
         Holder currentHolder = null;
         for(Holder holder : holderList){
             System.out.println("holderId="+holder.getHolderId());
             System.out.println("company="+holder.getCompanyAccounts());
             if((holder.getHolderId()+"").equals(id)){            
                 currentHolder = holder;
                 break;
             }
         }
         System.out.println(util.convertObjectToJSONString(currentHolder));
         if(currentHolder!= null){
             dataStore.saveObject("holder", currentHolder, httpSession);
               Map <String,Object> viewDetails = util.getRelatedViewList(httpSession,"queryShareholderAccount");
               Map<String,RelatedTask> relatedTask = (Map<String,RelatedTask>) viewDetails.get("viewList");
               String hole =(String) viewDetails.get("hole");
             if(relatedTask!=null){
                 mv.addObject("relatedTask", relatedTask);
             }
             mv.addObject("appendageUrl","../../relatedtask/shareholder?hole="+hole+"&id="+id);
             mv.addObject("holder", currentHolder);
         }
         
         
         return mv;
     }
     
     
     @RequestMapping(value = {"relatedtask/shareholder"}, method = RequestMethod.GET)
     public ModelAndView relatedTask(@RequestParam (value="hole", required = true) String hole,
             @RequestParam (value="id", required = true) String id, @RequestParam(value="key", required = true) String key,
             HttpSession httpSession,Utility util) throws MalformedURLException, URISyntaxException, ClassNotFoundException, InstantiationException, IllegalAccessException, IOException{
         ModelAndView mv = util.getRelatedTaskView(httpSession, hole, key, context, "holder", "editHolder");
         return mv;
     }
}
