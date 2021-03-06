import React from 'react';
import ParameterField from './ParameterField';
import { Button, Form } from 'semantic-ui-react';
import './StepListItem.css';
import { hasDefinedKey } from '../Utils';
import { numToSSColumn } from '../Utils';

const DropDown = ({value,setValue}) => {

    const dropdownOptions = [
        {key: 'none', text:'(None)', value: 'none'},
        {key: 'isobaric', text:'Isobaric', value:'isobaric'},
        {key: 'isochoric', text:'Isochoric', value:'isochoric'},
        {key: 'isothermal', text:'Isothermal', value:'isothermal'},
        {key: 'isentropic', text:'Isentropic', value:'isentropic'},
    ]

    return(
        <Form.Dropdown 
            search selection 
            options={dropdownOptions} 
            label='Step Type' 
            onChange={(e,data)=>{setValue(data.value)}}
            value={value}
            className='no-drag'
        />
    )
}

const StepListItem = ({step,index,setStep,deleteStep,deleteDisabled}) => {

    var entropyReadOnly = true

    if (hasDefinedKey(step,'staticEntropy')){
        step.entropy = step.staticEntropy
        entropyReadOnly = false
    }
    if (!hasDefinedKey(step,'entropy')){
        step.entropy = ''
    }

    if (!hasDefinedKey(step,'entropyChange')){
        step.entropyChange = ''
    }

    const stepUpdateFunction = (param) =>{
        setStep(index,param)
    }

    var deleteButtonParams = {
        size: 'small',
        icon: 'trash',
        onClick: ()=>{deleteStep(index)},
        className: 'no-drag',
    }

    if (deleteDisabled){
        deleteButtonParams.disabled = true
    }else{
        deleteButtonParams.negative = true
    }

    const firstLinefieldProperties = [
        {
            label: 'Pressure (Pa)',
            key: 'pressure',
            readOnly: false,
            updateKey: 'pressure',
        },{
            label: 'Volume (m^3)',
            key: 'volume',
            readOnly: false,
            updateKey: 'volume',
        },{
            label: 'Temperature (K)',
            key: 'temperature',
            readOnly: false,
            updateKey: 'temperature',
        },{
            label: 'Entropy (J/K)',
            key: 'entropy',
            readOnly: entropyReadOnly,
            updateKey: 'staticEntropy'
        }
    ]

    return(
        <div className='ui container step-list-item'>
            <div className='ui large form'>
                <div>
                    <h4 className='item-title'>
                        <i className='pad-right'>Point {numToSSColumn(index+1)}</i>
                        <Button 
                            {...deleteButtonParams}
                        ></Button>
                    </h4>
                </div>
                <div className='fields'>
                    {firstLinefieldProperties.map((item)=>{return(
                        <ParameterField 
                            label={item.label}
                            value={step[item.key]}
                            key={item.label}
                            readOnly={item.readOnly}
                            updateValue={stepUpdateFunction}
                            updateKey={item.updateKey}
                        />
                    )})}
                </div>
                <div className='fields'>
                    <div className='step-list-dropdown-wrapper'>
                        <DropDown 
                            value={step.type}
                            setValue={(value)=>{stepUpdateFunction({type: value})}}
                        />
                    </div>
                    <ParameterField
                        label='Entropy Change (J/K)'
                        value={step.entropyChange}
                        key='entropyChange'
                        readOnly={true}
                        updateKey='entropyChange'
                        updateValue={stepUpdateFunction}
                    />
                    <ParameterField
                        label='Work done (J)'
                        value={step.work}
                        key='work'
                        readOnly={true}
                        updateValue={stepUpdateFunction}
                        updateKey=''
                    />
                    <ParameterField
                        label='Heat supplied (J)'
                        value={step.heat}
                        key='heat'
                        readOnly={true}
                        updateValue={stepUpdateFunction}
                        updateKey=''
                    />
                </div>
                <hr/>
            </div>
        </div>
    )
}

export default StepListItem