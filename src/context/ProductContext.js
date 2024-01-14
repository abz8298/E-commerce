import axios from "axios";
import { createContext, useContext, useEffect, useReducer } from "react";
import reducer from "../reducer/productReducer";


const AppContext = createContext();

const API = "https://api.pujakaitem.com/api/products";

const initialState = {
    isLoading: false,
    isError: false,
    products: [],
    featureProducts: [],
    isSingleLoading: false,
    SingleProduct: {},
};

const AppProvider = ({children}) =>{

    const [state, dispatch] = useReducer(reducer, initialState);

    const getProducts = async (url)=>{
        dispatch({type: "API_LOADING"});
        try{
        const res = await axios.get(url);
        const products = await res.data; 
        dispatch({type: "SET_API_DATA", payload: products});
    } catch (err){
        dispatch({type: "API_ERROR"});
    }
    
    };

    // my 2nd api call for single product

    const getSingleProduct = async (url) =>{
        dispatch({type: "SET_SINGLE_LOADING"});
        try {
            const res = await axios.get(url);
            const SingleProduct = await res.data; 
            dispatch({type: "SET_SINGLE_PRODUCT", payload: SingleProduct});
        } catch (error) {
            dispatch({type: "SET_SINGLE_ERROR"});
        }
    }

    useEffect(()=>{
        getProducts(API);
    },[]);
    //[] denotes for the sirf😀 first time when page is loaded.


     return <AppContext.Provider value={{...state, getSingleProduct}}>{children}</AppContext.Provider>
};

// custom hooks
const useProductContext = () =>{
    return useContext(AppContext);
}

export {AppProvider, AppContext, useProductContext};
