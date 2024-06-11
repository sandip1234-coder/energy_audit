




function mainCalculation(){

    // Required inputs
    var RatedCap=parseInt(document.getElementById("RatedCap").value);
    var DailyUsage=parseInt(document.getElementById("DailyUsage").value);

    var DaysPerMonth=parseInt(document.getElementById("DaysPerMonth").value);
    var NoOfLuminaries=parseInt(document.getElementById("NoOfLuminaries").value);
    var Tarrif=parseInt(document.getElementById("tariff").value);
    var RoomLen=parseInt(document.getElementById("roomLength").value);
    var RoomWidth=parseInt(document.getElementById("roomWidth").value);
    var RoomHeight=parseInt(document.getElementById("roomHeight").value);
    var Lumens=parseInt(document.getElementById("Lumens").value);
    var NTable=parseInt(document.getElementById("buildingIdentification").value);

    
    // Calculations
    
    function GetUF(RI){
        var all=[0.6,0.8,1,1.25,1.5,2,2.5,3,4,5]
        var i=0;
        while(all[i]<RI){
            i+=1;
        }
        var tempnew=[0.37,0.46,0.53,0.59,0.65,0.72,0.78,0.81,0.86,0.9]
        var low=all[i-1];
        var high=all[i];
        var tempRi=0;
        if((RI-low<high-RI )||(high==RI)){
            tempRi=i;
        }
        else{
            tempRi=i-1;
        }
       
       
        return tempnew[tempRi];
    
    }
    
 
        
    
    // constant for every rooom
    // pre calc values
    
    const equipDropRef=document.getElementById("equipmentNameSingle");
    
    var LLF=0.8;


    var RI=(RoomLen*RoomWidth)/(RoomHeight*(RoomLen+RoomWidth));
    var UF=GetUF(RI);

   
    
    function CalculateValues({RatedCap,
        DailyUsage,
        DaysPerMonth,
        NoOfLuminaries,
        Tarrif,
        RoomLen,
        RoomWidth,
        Lumens,
        calcN,
        specDataIdx,
    }){


        specDataIdx=parseInt(specDataIdx);
        var output={}
        if(calcN){

            var N=Math.round((RoomLen*RoomWidth*NTable)/(Lumens*UF*LLF));
            // console.log(N);
        }
        else{
            N=NoOfLuminaries
        }
        
        var MEC = (RatedCap*DailyUsage*DaysPerMonth*N)/1000;
        var Eav=(N*Lumens*UF*LLF)/(RoomLen*RoomWidth);
  
        output["MEC"] = MEC;
        output["Eav"] = Eav;
        output["N"] = N;
        output["Bill"]=MEC*Tarrif;
        output["LE"]=Lumens/RatedCap;
        output["W/m2"]=(N*RatedCap)/(RoomLen*RoomWidth);
        output["EPI"]=(MEC*12)/(RoomWidth*RoomLen);
        output["nx"]=Math.round(Math.sqrt((RoomLen/RoomWidth)*N+((RoomLen-RoomWidth)/(Math.pow(RoomLen,2)*N))))
        output["ny"]=Math.round(N/output["nx"]);
        output["investment"]=parseInt(specData[specDataIdx]["Cost per piece (Rs)"])*N;
        output["tempN"]=Math.round((RoomLen*RoomWidth*NTable)/(Lumens*UF*LLF));

        return output;
    }
    
    
    var data={
        "RatedCap":RatedCap,
        "DailyUsage":DailyUsage,
        "DaysPerMonth":DaysPerMonth,
        "NoOfLuminaries":NoOfLuminaries,
        "Tarrif":Tarrif,
        "RoomLen":RoomLen,
        "RoomWidth":RoomWidth,
        "Lumens":Lumens, 
        "calcN":false,
        "specDataIdx":1,
    
    }

    function RecommnedationLight(data,monBill,currEav){

        var tempdata={}
        const recTable=document.getElementById("rec-table-body")
        Object.assign(tempdata, data);
        var totalString="";
        var recNo=1;
        for(var i=0;i<specData.length;i++){
            if(i!=equipDropRef.value){  

                if(i==3){
                    break;
                }
                // console.log(tempdata);
                tempdata["RatedCap"]=specData[i]["power"]
                tempdata["Lumens"]=specData[i]["lumen"]
                tempdata["calcN"]=true
                tempdata["specDataIdx"]=i
                
                tempcalc=CalculateValues(tempdata);
                // console.log(tempcalc)
                var total_inv=Math.round(tempcalc["investment"]);
                var net_saving=monBill-tempcalc["Bill"];
                var roi=Math.round(total_inv/net_saving);
 
                if(tempcalc["Bill"]<monBill && NTable<=tempdata["Eav"]<=currEav){

                    var ECP=specData[i]["power"]*tempcalc["N"];
                    var MEC=((tempdata["DaysPerMonth"]*tempdata["DailyUsage"]*ECP)/1000).toFixed(2)

                    var tempString=`     
                    <br>
                    <br>               <div>
                    <h4>Recommendation ${recNo} </h4>
                    <hr>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Model Name</th>
                                <th scope="col">Power(W)</th>
                                <th scope="col">Lumen</th>
                                <th scope="col">Star Rating(lm/W)</th>
                                <th scope="col">Life (10<sup>3</sup>)</th>
                                <th scope="col">CRI</th>
                                <th scope="col">Applications</th>
                                <th scope="col">Cost Per Peice (₹)</th>
                            

                            </tr>
                        </thead>
                        <tbody>
                        <td>${specData[i]["name"]}</td>
                        <td>${specData[i]["power"]}</td>
                        <td>${specData[i]["lumen"]}</td>
                        <td>${specData[i]["System efficacy"]}</td>
                     
                        <td>${specData[i]["Life"]}</td>
                        <td>${specData[i]["CRI"]}</td>
                        
                        <td>${specData[i]["Application"]}</td>
                        <td>${specData[i]["Cost per piece (Rs)"]}</td>


                        </tbody>
                    </table>
                    <div class="row">
                        <div class="mb-3 col-md-4">
                            <label for="luminousEfficiency" class="form-label">Required Number of Luminaries </label>
                            <input type="number" class="form-control" value="${tempcalc["N"]}" readonly aria-readonly="true">
                        </div>
                        <div class="mb-3 col-md-4">
                        <label for="luminousEfficiency" class="form-label">Estimated Circuit Power (Watts)</label>
                        <input type="number" class="form-control" value="${ECP}" readonly aria-readonly="true">
                    </div>
                    </div>
                    <div class="row">
                    <h5>Savings Potential</h5>
                    <div class="mb-3 col-md-4">
                    <label for="luminousEfficiency" class="form-label">Monthly Energy Consumption(units) </label>
                    <input type="number" class="form-control" value="${MEC}" readonly aria-readonly="true">
                </div>
                        <div class="mb-3 col-md-4">
                            <label for="luminousEfficiency" class="form-label">Energy Reduction Per Month(units) </label>
                            <input type="number" class="form-control" value="${Math.round(net_saving/Tarrif)}" readonly aria-readonly="true">
                        </div>
                        <div class="mb-3 col-md-4">
                            <label for="luminousEfficiency" class="form-label">Monthly Monetary Saving(₹)</label>
                            <input type="number" class="form-control" value="${Math.round(net_saving)}" readonly aria-readonly="true">
                        </div>
                    </div>

                    <div class="row">
            
                        <div class="mb-3 col-md-4">
                            <label for="luminousEfficiency" class="form-label">Total Investment(₹)</label>
                            <input type="number" class="form-control" value="${total_inv}" readonly aria-readonly="true">
                        </div>
                        <div class="mb-3 col-md-4">
                            <label for="luminousEfficiency" class="form-label">Simple Payback Period (Months) </label>
                            <input type="number" class="form-control" value="${roi}" readonly aria-readonly="true">
                        </div>

                    </div>
      
                </div>`

                    totalString+=tempString
                    recNo+=1
                }
                
                
  

            }

        }
        if(totalString.length<2){
            var removeAll=document.getElementsByClassName("remove-nf");
            // console.log(removeAll);
            for(var i=0;i<removeAll.length;i++){
                removeAll[i].style.display="none";
                // console.log(removeAll[i])
            }
            // document.getElementById("show-nf").style.display="";
            // document.getElementById("message-here").outerHTML="<p style='color:red'> <br>Note: <br>The entered lighting system provides lower than recommend illuminance causing inconvenience and inefficiency to the operator.<br> </p>";

            
             totalString="";
        
             for(var i=0;i<specData.length;i++){
                if(i!=equipDropRef.value){
    
                    if(i=3){
                        break;
                    }
                    tempdata["RatedCap"]=specData[i]["power"]
                    tempdata["Lumens"]=specData[i]["lumen"]
                    tempdata["calcN"]=true
                    tempdata["specDataIdx"]=i
                    
                    tempcalc=CalculateValues(tempdata);
                    // console.log(tempcalc)
                    var total_inv=(tempcalc["investment"]);
                    var net_saving=monBill-tempcalc["Bill"];
 
                    var roi=Math.round(total_inv/net_saving);
                    
                    if( NTable<=tempcalc["Eav"]<=NTable+15){
    
    
                        var tempString=`                    <div>
                        <h4>Recommendation ${i+1}</h4>
                        <hr>
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Model Name</th>
                                    <th scope="col">Power(W)</th>
                                    <th scope="col">Lumen</th>
                                    <th scope="col">System Efficacy(lm/W)</th>
                                    <th scope="col">CRI</th>
                                    <th scope="col">Life (10<sup>3</sup>)</th>
                                    <th scope="col">Applications</th>
                                   
    
    
                                </tr>
                            </thead>
                            <tbody>
                            <td>${specData[i]["name"]}</td>
                            <td>${specData[i]["power"]}</td>
                            <td>${specData[i]["lumen"]}</td>
                            <td>${specData[i]["System efficacy"]}</td>
                         
                            <td>${specData[i]["CRI"]}</td>
                            
                            <td>${specData[i]["Life"]}</td>
                            <td>${specData[i]["Application"]}</td>
    
    
                            </tbody>
                        </table>
                        <div class="row">
                            <div class="mb-3 col-md-4">
                                <label for="luminousEfficiency" class="form-label">Required Luminaries </label>
                                <input type="text" class="form-control" value="${tempcalc["N"]}" readonly aria-readonly="true">
                            </div>
                            <div class="mb-3 col-md-4">
                                <label for="luminousEfficiency" class="form-label">Energy Saving(units) </label>
                                <input type="text" class="form-control" value="${Math.round(net_saving/Tarrif)}" readonly aria-readonly="true">
                            </div>
                            <div class="mb-3 col-md-4">
                                <label for="luminousEfficiency" class="form-label">Cost(₹)</label>
                                <input type="text" class="form-control" value=">${Math.round(net_saving)}" readonly aria-readonly="true">
                            </div>
                        </div>
    
                        <div class="row">
                        <div class="mb-3 col-md-4">
                        <label for="luminousEfficiency" class="form-label">Cost per Piece</label>
                        <input type="text" class="form-control" value="${specData[i]["Cost per piece (Rs)"]}" readonly aria-readonly="true">
                        </div>
                            <div class="mb-3 col-md-4">
                                <label for="luminousEfficiency" class="form-label">Total Investment(₹)</label>
                                <input type="text" class="form-control" value="${total_inv}" readonly aria-readonly="true">
                            </div>
                            <div class="mb-3 col-md-4">
                                <label for="luminousEfficiency" class="form-label">Simple Payback(Months) </label>
                                <input type="text" class="form-control" value="${roi}" readonly aria-readonly="true">
                            </div>
    
                        </div>
                    </div>`
    
                        totalString+=tempString
                    }
                
                }
    
            }
            }


        recTable.innerHTML=totalString;
    }

    
    calc=CalculateValues(data);
    console.log("data",calc)
    RecommnedationLight(data,calc["Bill"],calc["Eav"]);
    //console.log("Bill",calc["Bill"]);
    document.getElementById('dailyBill').value = (calc["Bill"]/DaysPerMonth).toFixed(2);
    document.getElementById('monthlyBill').value = calc["Bill"].toFixed(2);
    document.getElementById('yearlyBill').value = (calc["Bill"]*12).toFixed(2);
    //console.log("MEC",calc["MEC"]);
    document.getElementById('monthlyConsumption').value = calc["MEC"].toFixed(2);
    document.getElementById('estimateCircuit').value = DaysPerMonth*NoOfLuminaries;
    //console.log("RI",RI);
    // document.getElementById('roomIndex').value = RI;
    //console.log("N",N);
    // document.getElementById('fittingNumber').value = N;
    //console.log("Eav",Eav);
    // document.getElementById('eav').value = Eav;
    //console.log("LE",calc["LE"]);
    document.getElementById('luminousEfficiency').value = calc["LE"].toFixed(2);
    //console.log("W/m2",calc["W/m2"]);
    document.getElementById('wpm2').value = calc["W/m2"].toFixed(2);
    //console.log("EPI",calc["EPI"]);
    document.getElementById('epi').value = calc["EPI"].toFixed(2);





    document.getElementById("nooflights").value=calc["tempN"];
    document.getElementById("Eav").value=calc["Eav"].toFixed(2);
       document.getElementById("rows").value=calc["nx"];
      document.getElementById("cols").value=calc["ny"];
      document.getElementById("deltax").value=(RoomLen/(calc["nx"]-1)).toFixed(2);
      document.getElementById("deltay").value=(RoomWidth/(calc["ny"]-1)).toFixed(2);
}
    
  
