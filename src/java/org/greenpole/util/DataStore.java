/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.servlet.http.HttpSession;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm) 
 */
public class DataStore {
    
    private Map<String,Object> dataStore = new HashMap();
    
    public boolean saveObject(String key,Object object,HttpSession httpSession){
        this.dataStore = this.getDataStore(httpSession);
        if(this.dataStore == null)
            this.dataStore = new HashMap();
        this.dataStore.put(key, object);
        this.setDataStore(this.dataStore, httpSession);
        return true;
    }
    
    public Object getObject(String key,HttpSession httSession){
        this.dataStore = this.getDataStore(httSession);
       Object object = this.dataStore == null ? null : this.dataStore.get(key);
       return object;
    }
    /**
     * @param httpSession
     * @return the dataStore
     */
    public Map<String,Object> getDataStore(HttpSession httpSession) {
        return (Map<String, Object>) httpSession.getAttribute(httpSession.getId());
    }

    /**
     * @param dataStore the dataStore to set
     * @param httpSession
     */
    public void setDataStore(Map<String,Object> dataStore,HttpSession httpSession) {
        httpSession.setAttribute(httpSession.getId(), dataStore);
    }
    
    public List getDataSegment(Object pageSize, Object page,List Data){
        int offset=0;
        int start = 0;
        int end = 0;
        int pagesize =1;
        if(page!=null && !page.toString().equalsIgnoreCase("all")){
            int _page=Integer.parseInt(page.toString());
            offset=Math.abs(_page-1) * Integer.parseInt(pageSize.toString());
            end=offset+Integer.parseInt(pageSize.toString());
            pagesize = Integer.parseInt(pageSize.toString());
        }
        else{
            offset=0;
            end = Data.size();
        }
        start=offset;
        
        
        if(end>Data.size())
           end=Data.size();
       List subDataList = new ArrayList();
       int i=0;
       for(int k=start;k<end;k++){
           subDataList.add(Data.get(k));
       }
       double size=Data.size();
       int numOfPage=(int)Math.ceil(size/pagesize);
       Set pageList=new HashSet();
       for(int j=1;j<=numOfPage;j++){
           pageList.add(j);
       }
          
       List returnDataList=new ArrayList();
       returnDataList.add(pageList);
       returnDataList.add(subDataList);
       returnDataList.add(Data.size());
        return returnDataList;
       
        
    }
    
}
