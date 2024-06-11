
function Hvac(){
    // water cooled condensor
    
    
    // constants
    var CP=1;
    var d=997;
    
    
    //usre inputs
    var duration_run=parseFloat(document.getElementById("durationofrun").value);
    var ql=parseFloat(document.getElementById("Ql").value);
    var Tei=parseFloat(document.getElementById("Tei").value);
    var Teo=parseFloat(document.getElementById("Teo").value);
    var Wm=parseFloat(document.getElementById("Wm").value);
    var nt=parseFloat(document.getElementById("nt").value);//drop down
    
    
    
    // calc
    var Wc =  Wm*0.92*nt
    
    
    var Qe=(ql*d*(Tei-Teo))//need to change this
    
    
    document.getElementById("Qe").value=Qe.toFixed(2);
    
    var R=Qe/3.51*3600;
    // document.getElementById("R").value=R;
    document.getElementById("Wc").value=Wc.toFixed(2);
    
    var COP= (Qe*3.51)/ (Wc);         
    document.getElementById("COP").value=COP.toFixed(2);
    // done under here
    var EER = COP*3.418	;
    document.getElementById("EER").value=EER.toFixed(2);
      
    var SPC = 3.51 / COP;
    document.getElementById("SPC").value=SPC.toFixed(2);
    
    // recommendation
tableData=[]

waterRec.forEach((o)=>{

    star=["5 Star","4 Star","3 Star","2 Star","1 Star"]
    for(var i=0;i<star.length;i++){
        starR=star[i];
        tempD=o;
        tempD["selectedStar"]=starR
        if(parseFloat(starR)>EER){

            tableData.push(o);
        }
        break;
    }

    
})
console.log(tableData)
finalTableData=""
for(var i=0;i<tableData.length;i++){

    temp=`
    <tr>
    <td scope="col">${tableData[i]["Company"]}</td>
    <td scope="col">${tableData[i]["Model"]}</td>
    <td scope="col">${tableData[i]["Refrigerant"]}</td>
    <td scope="col">${tableData[i]["Nominal Cooling Capacity"]}</td>
    <td scope="col">${tableData[i]["Length"]}</td>
    <td scope="col">${tableData[i]["Width"]}</td>
    <td scope="col">${tableData[i]["Height"]}</td>
    <td scope="col">${tableData[i]["Power Supply"]}</td>
    <td scope="col">${tableData[i]["selectedStar"]}</td>
    <tr>
`;
    finalTableData+=temp;
}
document.getElementById("output-table-body").innerHTML=finalTableData;
// recommendation end

    }


	
