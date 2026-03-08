import Upload from "./components/Upload";
import QA from "./components/QA";
import Summary from "./components/Summary";

function App(){

  return(

    <div style={{padding:"40px"}}>

      <h1>AI Document Intelligence</h1>

      <Upload/>

      <hr/>

      <QA/>

      <hr/>

      <Summary/>

    </div>

  )

}

export default App;