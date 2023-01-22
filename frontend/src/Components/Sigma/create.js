import React from 'react';
import  YaraDataService from '../../services/yara.service';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import { useParams, useNavigate } from 'react-router-dom';
import ButtonUnstyled from '@mui/base/ButtonUnstyled';


export default function App(){

    const [rule, setRule] = React.useState(null);
    const [response, setResponse] = React.useState(null);

    const handleInput = event  => {
      setRule(event.target.value)
    }
    
    const handleSubmit = (event) => {
      event.preventDefault();
      
      fetch(`/sigma?rules_text=${rule}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }).then((response) => {
        setResponse(response.data['msg']);
        console.log(response.data['msg']);
      }).catch(function (error) {
          if (error.response)
            {
              console.log(error.response);
              console.log(rule);
            }
      })}

    if (!response){
      return (
              <div>
                <form onSubmit={handleSubmit}>
                <TextareaAutosize
                name="rules-text"
                placeholder="Empty"
                style={{ width: 200 }}
                onChange={handleInput}
                />
                <ButtonUnstyled type="submit">{'Submit'}</ButtonUnstyled>
                </form>
              </div>
      )
    }
    return (
      <div>
        <form onSubmit={handleSubmit}>
        <TextareaAutosize
        name="rules-text"
        placeholder="Empty"
        style={{ width: 200 }}
        onChange={handleInput}
        />
        <ButtonUnstyled type="submit">{'Submit'}</ButtonUnstyled>
        </form>
        <hr/>
        <TextareaAutosize
          style={{ width: 200 }}
          value={response}/>
      </div>
)

}