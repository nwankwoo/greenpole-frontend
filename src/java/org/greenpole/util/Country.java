/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.greenpole.util;

import java.util.List;

/**
 *
 * @author Yusuf Samsudeen Babashola (Algorithm)
 */
public class Country {
    
    private int id;
    private String name;
    private String code;
    private String continent;
    private List<State> state;

    public Country(int id, String name, String code, String continent, List<State> state) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.continent = continent;
        this.state = state;
    }

    
    
    /**
     * @return the id
     */
    public int getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(int id) {
        this.id = id;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * @param code the code to set
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * @return the continent
     */
    public String getContinent() {
        return continent;
    }

    /**
     * @param continent the continent to set
     */
    public void setContinent(String continent) {
        this.continent = continent;
    }

    /**
     * @return the state
     */
    public List<State> getState() {
        return state;
    }

    /**
     * @param state the state to set
     */
    public void setState(List<State> state) {
        this.state = state;
    }
    
}
