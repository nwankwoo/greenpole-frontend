package org.greenpole.util;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import org.greenpole.entity.model.clientcompany.ClientCompany;
import org.greenpole.entity.model.clientcompany.ShareQuotation;
import org.greenpole.entity.model.holder.Holder;
import org.greenpole.entity.model.holder.merge.AccountConsolidation;
import org.greenpole.entity.response.Response;
import org.greenpole.model.profiler.RelatedTask;
import org.greenpole.model.profiler.UserProfile;
import org.greenpole.model.profiler.ViewGroup;
import org.greenpole.model.profiler.ViewList;
import org.springframework.web.servlet.ModelAndView;

/**
 * <h1>Utility</h1>
 * This is a utility class responsible for some house keeping task
 * @author Yusuf Samsudeen Babashola (Algorithm)
 */
public class Utility {
    /**
     * This method is responsible for looking up views requested by user
     * @param viewName
     * @param context
     * @param viewType
     * @param appendType
     * @return 
     */
    public  String lookUpView(String viewName,URI context,String viewType,boolean appendType){
        String viewPath=null;
        try{
            FileUtility.Finder finder=new FileUtility.Finder (viewName.trim().concat(viewType));
            Path startingDir=Paths.get(context);
            Files.walkFileTree(startingDir,finder);
            Path filepath=finder.done();            
            viewPath=filepath.getParent().toString().concat(File.separator+filepath.getFileName().toString());
            int start=viewPath.lastIndexOf("viewList".concat(File.separator))+9;
            int end=viewPath.length();
            viewPath=viewPath.substring(start,end);
            viewPath=viewPath.substring(0,viewPath.lastIndexOf(viewType));
            viewPath=viewPath.replace(File.separator,"/");
            if(appendType){
                viewPath=viewPath.concat(viewType);
                
            }
        }catch(Exception ex){
            
        }
        return viewPath;
    }
    
    public  String lookUpFile(String fileName,URI context){
        String filePath=null;
        try{
            FileUtility.Finder finder=new FileUtility.Finder (fileName.trim());
            Path startingDir=Paths.get(context);
            Files.walkFileTree(startingDir,finder);
            Path filepath=finder.done();            
            filePath=filepath.getParent().toString().concat(File.separator+filepath.getFileName().toString());
            
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return filePath;
    }
    
    /**
     * This method is responsible loading up assigned model and any other class
     * related to a view
     * @param className
     * @param startURI
     * @return 
     */
    public Class lookUpClass(String className,URI startURI){
        Class matchedClass=null;
        try{
           
            FileUtility.Finder finder=new FileUtility.Finder (className.trim()+".class");
            Path startingDir=Paths.get(startURI);
            Files.walkFileTree(startingDir,finder);
            Path filepath=finder.done();
            String classPath=filepath.getParent().toString().concat(File.separator+filepath.getFileName().toString());
            
            int start=classPath.lastIndexOf("classes".concat(File.separator))+8;
            int end=classPath.length();
            classPath=classPath.substring(start,end).replace(File.separator,".");
            classPath=classPath.substring(0,classPath.lastIndexOf(".class"));
           matchedClass=Class.forName(classPath);
            
        }catch(Exception ex){
            ex.printStackTrace();
        }
        return matchedClass;
    }
    
    /**
     * This method is responsible for validating view mapping
     * against what is loaded in the user session.
     * This is necessary for security reasons
     * @param key
     * @param hole
     * @param viewName
     * @param session
     * @return 
     */
    public boolean validateViewMapping(String key,String hole,String viewName,HttpSession session){
        boolean valid=false;
        if(session.getAttribute("userprofile")!=null){
            UserProfile userprofile=(UserProfile) session.getAttribute("userprofile");
            ViewGroup viewGroup=userprofile.getViews().get(hole);
            if(viewGroup!=null){
               ViewList viewList= viewGroup.getViewList().get(key);
               if(viewList!=null){
                   String userProfileViewName=viewList.getViewName().trim();
                   if(userProfileViewName.equalsIgnoreCase(viewName))
                       valid=true;
               }
            }            
        }
        
        return valid;
    }
    
    
    public boolean validateRelatedTaskViewMapping(String key,String hole,String viewName,HttpSession session){
        boolean valid=false;
        if(session.getAttribute("userprofile")!=null){
            UserProfile userprofile=(UserProfile) session.getAttribute("userprofile");
            ViewGroup viewGroup=userprofile.getViews().get(hole);
            if(viewGroup!=null){
               ViewList viewList= viewGroup.getViewList().get(key);
               if(viewList!=null){
                   String userProfileViewName=viewList.getViewName().trim();
                   if(userProfileViewName.equalsIgnoreCase(viewName))
                       valid=true;
               }
            }            
        }
        
        return valid;
    }
    
    /**
     * This method converts object to JSON string
     * @param object
     * @return
     * @throws IOException 
     */
    public String convertObjectToJSONString(Object object) throws IOException{
        String JSONString=null;
        ObjectWriter ow=new ObjectMapper().writer().withDefaultPrettyPrinter();
        JSONString =ow.writeValueAsString(object);
        return JSONString;
    }
    
    public double calculateHoldings(JsonNode accountNode,String accountType){
        double holdings = 0.0;
        for(final JsonNode account: accountNode){
            if(accountType.equals("bond")){
                holdings+=account.get("bondUnits").asDouble();
            }
            else if(accountType.equals("shares")){
                holdings+=account.get("shareUnits").asDouble();
            }
            
        }
        return holdings;
    }
    
    public String getHolderAddress(JsonNode addressListNode){
        String address = "";
        for(final JsonNode addressNode : addressListNode){
            String subAddress = "";
            String addressLine1 = "";
            String addressLine2 = "";
            String addressLine3 = "";
            String addressLine4 = "";
            String postCode = "";
            String city = "";
            String state = "";
            String country = "";
            
            if (!addressNode.get("addressLine1").asText().equals("null")){
                addressLine1 = addressNode.get("addressLine1").asText();
            }
            if (!addressNode.get("addressLine2").asText().equals("null")){
                addressLine2 = addressNode.get("addressLine2").asText();
            }
            if (!addressNode.get("addressLine3").asText().equals("null")){
                addressLine3 = addressNode.get("addressLine3").asText();
            }
            if (!addressNode.get("addressLine4").asText().equals("null")){
                addressLine4 = addressNode.get("addressLine4").asText();
            }
            if (!addressNode.get("postCode").asText().equals("null")){
                postCode = addressNode.get("postCode").asText();
            }
            if (!addressNode.get("city").asText().equals("null")){
                city = addressNode.get("city").asText();
            }
            if (!addressNode.get("state").asText().equals("null")){
                state = addressNode.get("state").asText();
            }
            if (!addressNode.get("country").asText().equals("null")){
                country = addressNode.get("country").asText();
            }
            subAddress = "";
            subAddress = subAddress.concat(addressLine1).concat(",")
                    .concat(addressLine2).concat(",")
                    .concat(addressLine3).concat(",")
                    .concat(addressLine4).concat(",")
                    .concat(postCode).concat(",")
                    .concat(city).concat(",")
                    .concat(state).concat(",")
                    .concat(country).concat(",");
                    
            /*address += address.concat(addressNode.get("addressLine1").asText()).concat(",").concat("\n")
                    .concat(addressNode.get("addressLine2").asText()).concat(",").concat("\n")
                    .concat(addressNode.get("addressLine3").asText()).concat(",").concat("\n")
                    .concat(addressNode.get("addressLine4").asText()).concat(",").concat("\n")
                    .concat(addressNode.get("postCode").asText()).concat(",").concat("\n")
                    .concat(addressNode.get("city").asText()).concat(",").concat("\n")
                    .concat(addressNode.get("state").asText()).concat(",").concat("\n")
                    .concat(addressNode.get("country").asText()).concat("\n");*/
            address+=subAddress;
        }
        return address;
    }
    public List extractShareholderData(HttpSession httpSession) throws IOException{
        List shareholderData = new ArrayList(2);
        DataStore dataStore = new DataStore();
        Object holderObject = dataStore.getObject("shareholderList",httpSession);
        List shareholderList =(List<Holder>) holderObject;
        shareholderList = dataStore.getDataSegment("ALL", "ALL", shareholderList);
        String list = this.convertObjectToJSONString(shareholderList);
        System.out.println(list);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.convertValue(shareholderList, JsonNode.class);
        Map<String, Object[]> header = new TreeMap();
        Map<String, Object[]> content = new TreeMap();
        int node = 2;
        String holderName;
        String chnnumber;
        String address;
        String phoneNumbers;
        double holdings;
        String type;
        root=root.get(1);
        header.put("1", new Object[]{"Holder Name","CHN Number","Address","Phone Number(s)","Total Holdings","Holder Type"});
       
            for(final JsonNode holderNode : root ){
            holderName = holderNode.get("firstName").asText()+" "+holderNode.get("middleName").asText()+" "+holderNode.get("lastName").asText();
            chnnumber = holderNode.get("chn").asText();
            JsonNode residentialAddresses = holderNode.get("residentialAddresses");
            address = this.getHolderAddress(residentialAddresses);
            
            JsonNode phoneNumberNodes = holderNode.get("phoneNumbers");
            phoneNumbers = "";
            for (final JsonNode phoneNumberNode : phoneNumberNodes){
                phoneNumbers+=phoneNumberNode.get("phoneNumber").asText()+"\t ";
            }
            holdings = this.calculateHoldings(holderNode.get("companyAccounts"),"shares");
            type = holderNode.get("typeId").asText();
            content.put(node+"", new Object[]{holderName,chnnumber,address,phoneNumbers,holdings,type});
            node++;
            }
            shareholderData.add(header);
            shareholderData.add(content);
            return shareholderData;
    }
    public List extractBondholderData(HttpSession httpSession) throws IOException{
        List shareholderData = new ArrayList(2);
        DataStore dataStore = new DataStore();
        Object holderObject = dataStore.getObject("bondholderList",httpSession);
        List bondholderList =(List<Holder>) holderObject;
        bondholderList = dataStore.getDataSegment("ALL", "ALL", bondholderList);
        String list = this.convertObjectToJSONString(bondholderList);
        System.out.println(list);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.convertValue(bondholderList, JsonNode.class);
        Map<String, Object[]> header = new TreeMap();
        Map<String, Object[]> content = new TreeMap();
        int node = 2;
        String holderName;
        String chnnumber;
        String address;
        String phoneNumbers;
        double holdings;
        String type;
        root=root.get(1);
        header.put("1", new Object[]{"Holder Name","CHN Number","Address","Phone Number(s)","Total Holdings","Holder Type"});
       
            for(final JsonNode holderNode : root ){
            holderName = holderNode.get("firstName").asText()+" "+holderNode.get("middleName").asText()+" "+holderNode.get("lastName").asText();
            chnnumber = holderNode.get("chn").asText();
            JsonNode residentialAddresses = holderNode.get("residentialAddresses");
            address = this.getHolderAddress(residentialAddresses);
            
            JsonNode phoneNumberNodes = holderNode.get("phoneNumbers");
            phoneNumbers = "";
            for (final JsonNode phoneNumberNode : phoneNumberNodes){
                phoneNumbers+=phoneNumberNode.get("phoneNumber").asText()+"\t ";
            }
            holdings = this.calculateHoldings(holderNode.get("bondAccounts"),"bond");
            type = holderNode.get("typeId").asText();
            content.put(node+"", new Object[]{holderName,chnnumber,address,phoneNumbers,holdings,type});
            node++;
            }
            shareholderData.add(header);
            shareholderData.add(content);
            return shareholderData;
    }
    public Object appender(Object object) throws IOException{
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
        Map <String,Object> ccMap = mapper.readValue(this.convertObjectToJSONString(object), Map.class);
               Iterator it = ccMap.entrySet().iterator();
               Map <String, Object> newObjectMap = new HashMap();
               System.out.println("From Appender");
               while(it.hasNext()){
                   Map.Entry pair = (Map.Entry) it.next();
                   
                   if(pair.getValue()!=null){
                       System.out.println(pair.getKey()+" "+pair.getValue()+" "+pair.getValue().getClass());
                       if(pair.getValue().getClass() == String.class ){
                            newObjectMap.put((String) pair.getKey(), "%"+((String) pair.getValue())+"%");
                       }
                       else if (pair.getValue().getClass() == ArrayList.class){
                           List subList = (List)pair.getValue();
                           newObjectMap.put((String) pair.getKey(), this.appender(subList.get(0)));
                       }
                       else{
                            newObjectMap.put((String) pair.getKey(), (pair.getValue()));
                       }
                   }
                   /*else{
                       newObjectMap.put((String) pair.getKey(), (pair.getValue()));
                   }*/
               }
               mapper.convertValue(newObjectMap, ArrayList.class);
        return newObjectMap;
    }
    
    /**
     * 
     * @param httpSession
     * @param hole
     * @param key
     * @param context
     * @param objectName
     * @param conditionalViewName
     * @return
     * @throws URISyntaxException
     * @throws MalformedURLException
     * @throws ClassNotFoundException
     * @throws InstantiationException
     * @throws IllegalAccessException
     * @throws IOException 
     */
    public ModelAndView getRelatedTaskView(HttpSession httpSession,String hole,String key,ServletContext context,
            String objectName, String conditionalViewName) throws URISyntaxException, MalformedURLException, ClassNotFoundException, InstantiationException, IllegalAccessException, IOException{
         UserProfile userprofile = (UserProfile) httpSession.getAttribute("userprofile");
         Utility util = new Utility();
          Map <String,ViewGroup> ViewGroups = userprofile.getViews();
          Iterator it = ViewGroups.entrySet().iterator();
          ModelAndView mv = new ModelAndView();
          DataStore dataStore = new DataStore();
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
                                System.out.println("view="+ view);
                                if (view!=null && !view.equals("")){
                                  
                                    Class model;
                                    if(!viewModel.isEmpty()){
                                        model=Class.forName(viewModel);
                                        mv.addObject(viewname,model.newInstance());
                                        System.out.println("viewnamessss="+viewname);
                                        mv.addObject(objectName, dataStore.getObject(objectName, httpSession));
                                    }
                                    else if(viewname.equals(conditionalViewName)){
                                        System.out.println(util.convertObjectToJSONString(dataStore.getObject(objectName, httpSession)));
                                        mv.addObject(objectName, dataStore.getObject(objectName, httpSession));
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
    
    public Map<String,Object> getRelatedViewList(HttpSession httpSession,String conditionalView) throws IOException{
        UserProfile profile = (UserProfile) httpSession.getAttribute("userprofile");
             Utility util = new Utility();
             Map <String,ViewGroup> ViewGroups = profile.getViews();
             System.out.println(util.convertObjectToJSONString(ViewGroups));
             Map<String,RelatedTask> relatedTask = null;
             Map<String,Object> returnObject = new HashMap();
             String hole = "";
             Iterator it = ViewGroups.entrySet().iterator();
        while(it.hasNext()){
                   Map.Entry pair = (Map.Entry) it.next();
                   ViewGroup viewGroup = (ViewGroup) pair.getValue();
                   Map <String, ViewList> viewLists = viewGroup.getViewList();
                   System.out.println(util.convertObjectToJSONString(viewLists));
                   Iterator viewListIterator = viewLists.entrySet().iterator();
                   while(viewListIterator.hasNext()){
                       Map.Entry viewListPair = (Map.Entry) viewListIterator.next();
                       ViewList viewList = (ViewList)viewListPair.getValue();
                       System.out.println(util.convertObjectToJSONString(viewList));
                       if(viewList.getViewName().equals(conditionalView)){
                           relatedTask = viewList.getRelatedTaskList();
                           hole = (String) viewListPair.getKey();
                       }
                   }
                   
               }
        returnObject.put("viewList", relatedTask);
        returnObject.put("hole", hole);
        return returnObject;
    }
    
    public String getURI(String filename){
        String filetype= filename.substring(filename.lastIndexOf(".")+1,filename.length());
        String uri = "data:image/"+filetype+";base64,";
        return uri;
    }
    
    public Holder getHolder(ServiceEngine serviceEngine,HttpSession httpSession,int holderId) throws MalformedURLException{
        Response response = serviceEngine.sendHolderRequest(httpSession, holderId, ServiceEngine.QUERY_SINGLE_HOLDER);
        List responseList = response.getBody();
        Holder holder = (Holder) responseList.get(0);
        return holder;
    }
    
    public ClientCompany getClientCompany(ServiceEngine serviceEngine,HttpSession httpSession,int clientCompanyId) throws MalformedURLException, IOException{
        Response response = serviceEngine.sendClientCompanyRequests(httpSession, clientCompanyId, ServiceEngine.QUERY_SINGLE_CLIENT_COMPANY);
        List responseList = response.getBody();
        System.out.println(this.convertObjectToJSONString(responseList));
        ClientCompany clientCompany = (ClientCompany) responseList.get(0);
        return clientCompany;
    }
    
    public List extractShareUnitQuotation(HttpSession httpSession) throws IOException{
        List shareunitData = new ArrayList(2);
        DataStore dataStore = new DataStore();
        Object holderObject = dataStore.getObject("shareunitquotation",httpSession);
        List shareunitquotation =(List<ShareQuotation>) holderObject;
        shareunitquotation = dataStore.getDataSegment("ALL", "ALL", shareunitquotation);
        String list = this.convertObjectToJSONString(shareunitquotation);
        System.out.println(list);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.convertValue(shareunitquotation, JsonNode.class);
        Map<String, Object[]> header = new TreeMap();
        Map<String, Object[]> content = new TreeMap();
        int node = 2;
        String ccname;
        String cccode;
        String unitprice;
        String phoneNumbers;
        double holdings;
        String type;
        root=root.get(1);
        header.put("1", new Object[]{"Client Company","Client Company Code","Share Unit Price"});
       System.out.println(this.convertObjectToJSONString(root));
            for(final JsonNode quotationNode : root ){
                JsonNode companyNode = quotationNode.get("clientCompany");
            ccname = companyNode.get("name").asText();
            cccode=companyNode.get("code").asText();
            unitprice=quotationNode.get("unitPrice").asText();
            content.put(node+"", new Object[]{ccname,cccode,unitprice});
            node++;
            }
            shareunitData.add(header);
            shareunitData.add(content);
            return shareunitData;
    }
    
    
    public List extractClientCompanyData(HttpSession httpSession) throws IOException{
        List clientCompanyData = new ArrayList(2);
        DataStore dataStore = new DataStore();
        Object ClientCompanyObject = dataStore.getObject("clientCompanies",httpSession);
        List clientCompaniesList =(List<ClientCompany>) ClientCompanyObject;
        clientCompaniesList = dataStore.getDataSegment("ALL", "ALL", clientCompaniesList);
        String list = this.convertObjectToJSONString(clientCompaniesList);
        System.out.println(list);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.convertValue(clientCompaniesList, JsonNode.class);
        Map<String, Object[]> header = new TreeMap();
        Map<String, Object[]> content = new TreeMap();
        int node = 2;
        String ccCode;
        String ccName;
        String address;
        String email;
        String shareholders;
        String bondholders;
        String shareUnitPrice;
        double holdings;
        String depository;
        root=root.get(1);
        header.put("1", new Object[]{"Company Code","Company Name","Address","Depository","Email Address","No. of Shareholders","No. of Bondholders","Share Unit Price"});
       
            for(final JsonNode ccNode : root ){
            ccCode = ccNode.get("code").asText();
            ccName = ccNode.get("name").asText();
            JsonNode residentialAddresses = ccNode.get("addresses");
            address = this.getHolderAddress(residentialAddresses);
            
            JsonNode emailAddressNode = ccNode.get("emailAddresses");
            email = "";
            for (final JsonNode emailNode : emailAddressNode){
                email+=emailNode.get("emailAddress").asText()+"\t ";
            }
            shareholders = ccNode.get("noShareholders").asText();
            bondholders = ccNode.get("noBondholders").asText();
            shareUnitPrice = ccNode.get("shareUnitPrice").asText();
            depository = ccNode.get("depositoryName").asText();
            content.put(node+"", new Object[]{ccCode,ccName,address,depository,email,shareholders,bondholders,shareUnitPrice});
            node++;
            }
            clientCompanyData.add(header);
            clientCompanyData.add(content);
            return clientCompanyData;
    }
    
    
    public List extractAccountConsolidationData(HttpSession httpSession) throws IOException{
        List consolidationData = new ArrayList(2);
        DataStore dataStore = new DataStore();
        Object ConsolidationObject = dataStore.getObject("consolidationList",httpSession);
        List consolidationList =(List<AccountConsolidation>) ConsolidationObject;
        consolidationList = dataStore.getDataSegment("ALL", "ALL", consolidationList);
        String list = this.convertObjectToJSONString(consolidationList);
        System.out.println(list);
        ObjectMapper mapper = new ObjectMapper();
        JsonNode root = mapper.convertValue(consolidationList, JsonNode.class);
        Map<String, Object[]> header = new TreeMap();
        Map<String, Object[]> content = new TreeMap();
        int node = 2;
        String holderName;
        String mergedTo;
        String mergedOn;
        String shareholders;
        String bondholders;
        String shareUnitPrice;
        double holdings;
        String depository;
        root=root.get(1);
        header.put("1", new Object[]{"Holder Name","Merged To","Merged On"});
       
            for(final JsonNode consolidationNode : root ){
            holderName = consolidationNode.get("holderName").asText();
            mergedTo = consolidationNode.get("mergedToHolderName").asText();
            mergedOn = consolidationNode.get("mergeDate").asText();
            
            content.put(node+"", new Object[]{holderName,mergedTo,mergedOn});
            node++;
            }
            consolidationData.add(header);
            consolidationData.add(content);
            return consolidationData;
    }
    
    public List loadRegionalSetting(){
        ClassLoader classLoader = getClass().getClassLoader();
        File file = new File(classLoader.getResource("/org/greenpole/countries/countries.json").getFile());
        List <Country> countriesList = new ArrayList();
        try{
            JsonFactory factory = new JsonFactory();
            
            JsonParser countriesParser = factory.createParser(file);
            ObjectMapper mapper = new ObjectMapper(factory);
            JsonNode rootNode = mapper.readTree(file);
            
            String country;
            String code;
            String stateJsonFile;
            String continent;
            List stateList = null;
            int i = 1;
            countriesList.add(new Country(0,"Select Country","","",stateList));
            for(JsonNode countryNode : rootNode){
                if(countryNode.get("filename") == null){
                    List<State> states = new ArrayList();
                    states.add(new State(1,"Others","N/A"));
                    stateList = states ;
                }
                else{
                    stateJsonFile = countryNode.get("filename").asText();
                    File stateFile = new File(classLoader.getResource("/org/greenpole/countries/"+stateJsonFile+".json").getFile());
                    stateList = processStateList(stateFile);
                }
                
                country = countryNode.get("name").asText();
                code = countryNode.get("code").asText();
                continent = countryNode.get("continent").asText();
                countriesList.add(new Country(i,country,code,continent,stateList));
                i++;
            }
        }catch(Exception ex){
            ex.printStackTrace();
        }
        
        
        return countriesList;
    }
    
    public List processStateList(File stateFile){
        JsonFactory factory = new JsonFactory();
        ObjectMapper mapper = new ObjectMapper(factory);
        List<State> stateList = new ArrayList();
        int i = 1;
        try {
            JsonNode rootNode = mapper.readTree(stateFile);
            String name;
            String code;
            stateList.add(new State(1,"Select State",""));
            for(JsonNode stateNode : rootNode){
                name = stateNode.get("name").asText();
                code = stateNode.get("code").asText();
                stateList.add(new State(i,name,code));
                i++;
            }
        } catch (Exception ex) {
            
        }
        return stateList;
    }
}
