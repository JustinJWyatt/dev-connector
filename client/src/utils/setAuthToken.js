import axios from "axios";

const setAuthToken = token => {
  if(token){
    axios.defaults.headers.common['Auhtorization'] = token;
  }else{
    delete axios.defaults.headers.common['Auhtorization'];
  }
}

export default setAuthToken;
