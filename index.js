

const equipDropRef=document.getElementById("equipmentNameSingle");
function createEquipmentDropDown(){
    tempString=`<option value=""></option>`
    for(var i=0;i<specData.length;i++){
        tempString+=`<option value="${i}">${specData[i]["name"] + " " } </option>`;
    }
    equipDropRef.innerHTML=tempString;
}

createEquipmentDropDown();


function onChangeEquipmentDropDown(){
    const lumnens=document.getElementById("Lumens");
    const ratedCap=document.getElementById("RatedCap");
    lumnens.value=specData[equipDropRef.value]["lumen"];
    ratedCap.value=specData[equipDropRef.value]["power"];
    var i=equipDropRef.value;
    document.getElementById("rec-table-body1").innerHTML=`
    <tr>
    
    <td>${specData[i]["name"]}</td>
    <td>${specData[i]["power"]}</td>
    <td>${specData[i]["lumen"]}</td>
    <td>${specData[i]["System efficacy"]}</td>
    <td>${specData[i]["Life"]}</td>

    <td>${specData[i]["CRI"]}</td>

  
    <td>${specData[i]["Application"]}</td>
  
    
     </tr>`
    mainCalculation();

}
