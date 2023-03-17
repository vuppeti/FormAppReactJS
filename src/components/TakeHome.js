import React, { useState,useEffect, useRef } from "react";
import { LineWave    } from "react-loader-spinner";

function TakeHome(){

    const [occupationData,setoccupationData] = useState([]);
    const [statesData,setstatesData] = useState([]);
    const [isFormSubmitted,setIsFormSubmitted] = useState(false); 
    const [formErrors,setFormErrors] = useState({});
    const [successfullySubmitted,setSuccessfullySubmitted] = useState(false);
    const formRef = useRef();

     
    const formValidation = (props) => {
        setFormErrors({});
        const errors = {}
        if(!props.name){
            errors.name = 'Full Name is required'
        }
        if(!props.email){
            errors.email = 'Email is required'
        }
        if( !props.occupation || props.occupation === "Occupation... *" ){
            errors.occupaion = 'Select your Occupation'
        }
        if(!props.state || props.state === "Select State...*"){
            errors.state = 'Select your state'
        }
        if(!props.password){
            errors.password = 'Password is required'
        }
        return errors;
    }
    useEffect(()=>{
        const fetchFormData=()=>{
            fetch('https://frontend-take-home.fetchrewards.com/form')
            .then(response => response.json())
            .then(json => {
                setoccupationData(json.occupations);
                setstatesData(json['states']);
            })
        }
        fetchFormData();
    }, []);

    const postFormData=(e)=>{
        e.preventDefault();
        //debugger;
        setIsFormSubmitted(true);
        const formValues1 = {
            
            "name": e.target.name.value,
            "email": e.target.email.value,
            "password": e.target.password.value,
            "occupation": e.target.occupation.value,
            "state": e.target.state.value
        };
        const fValidObj = (formValidation(formValues1));
        
        setFormErrors(fValidObj);
        if(Object.keys(fValidObj).length == 0){
            fetch('https://frontend-take-home.fetchrewards.com/form', {
                method: "POST",
                body: JSON.stringify(formValues1),
                headers: {"Content-Type": "application/json"}
            }).then(response => {
                response.json();
                if(response.status === 201){
                    formReset();
                    setSuccessfullySubmitted(true);
                    setIsFormSubmitted(false);
                    setTimeout(() => {
                        setSuccessfullySubmitted(false)
                    }, 3000)
                }
            })
        }else{setIsFormSubmitted(false)}
        
    }
    const formReset = () => {
        formRef.current.reset();
    }
    
    return (
        
        <>
        <form ref={formRef} onSubmit={postFormData}>
            {successfullySubmitted && 
            <div className="success-message">
                <p>Thank you for submitting the form!</p>
            </div>}
            <div className="formGrp">
                <input type="text" name="name"  placeholder="Full Name *"/>
                <div className="formErrors">{formErrors.name}</div>
            </div> 
            <div className="formGrp">
                <input type="text" name="email" placeholder="Email *"/>
                <div className="formErrors">{formErrors.email}</div>
            </div>
            <div className="formGrp">
                <select name="occupation" defaultValue={'Occupation... *'}>
                    <option value="Occupation... *" disabled="disabled">Occupation... *</option>
                    {occupationData.map((occupation)=><option>{occupation}</option>)}
                </select>
                <div className="formErrors">{formErrors.occupaion}</div>
            </div>    
            <div className="formGrp">
                <select name="state" defaultValue={'Select State...*'}>
                    <option value="Select State...*" disabled="disabled">Select State...*</option>
                    {statesData.map(states => <option>{states.name}</option>)}
                </select>
                <div className="formErrors">{formErrors.state}</div>
            </div>    
            <div className="formGrp">
                <input type="password" name="password" placeholder="Password *"/>
                <div className="formErrors">{formErrors.password}</div>
            </div>
            
            <button disabled={isFormSubmitted}>
                {isFormSubmitted && <span className="mx-4 spinner-grow spinner-grow-sm "></span>}
                Submit
            </button>           
        </form>
        </>
    )
    
 

}

export default TakeHome
