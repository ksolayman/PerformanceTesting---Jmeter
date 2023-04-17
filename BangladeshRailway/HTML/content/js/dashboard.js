/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8870967741935484, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-26"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-27"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-28"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-29"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-20"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-21"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-22"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-23"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-24"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-25"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-8"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://eticket.railway.gov.bd/en"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-6"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-7"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-16"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-17"], "isController": false}, {"data": [0.0, 500, 1500, "https://eticket.railway.gov.bd/en-18"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-19"], "isController": false}, {"data": [0.9821428571428571, 500, 1500, "https://eticket.railway.gov.bd/en-0"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://eticket.railway.gov.bd/en-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-30"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-31"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-10"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-32"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-11"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-33"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-12"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-34"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-13"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-35"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/en-14"], "isController": false}, {"data": [0.5, 500, 1500, "https://eticket.railway.gov.bd/en-36"], "isController": false}, {"data": [1.0, 500, 1500, "https://eticket.railway.gov.bd/booking/train/search-route?fromcity=Dhaka&tocity=Chattogram&doj=17-Apr-2023&class=AC_CHAIR"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 93, 0, 0.0, 414.0107526881719, 50, 4948, 273.0, 870.8000000000006, 1357.3999999999999, 4948.0, 17.775229357798167, 886.4189871225152, 23.91570204988532], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://eticket.railway.gov.bd/en-26", 1, 0, 0.0, 564.0, 564, 564, 564.0, 564.0, 564.0, 564.0, 1.7730496453900708, 61.36414007092199, 2.450063718971631], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-27", 1, 0, 0.0, 273.0, 273, 273, 273.0, 273.0, 273.0, 273.0, 3.663003663003663, 8.735405219780219, 5.0974416208791204], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-28", 1, 0, 0.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 2.8089887640449436, 7.732948560393258, 3.870589009831461], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-29", 1, 0, 0.0, 374.0, 374, 374, 374.0, 374.0, 374.0, 374.0, 2.6737967914438503, 17.311789772727273, 3.7208597927807485], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-20", 1, 0, 0.0, 1412.0, 1412, 1412, 1412.0, 1412.0, 1412.0, 1412.0, 0.708215297450425, 67.83097999291785, 0.9786373495042493], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-21", 1, 0, 0.0, 768.0, 768, 768, 768.0, 768.0, 768.0, 768.0, 1.3020833333333333, 21.540323893229168, 1.7992655436197915], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-22", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 22.589776529636712, 2.630930329827916], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-23", 1, 0, 0.0, 295.0, 295, 295, 295.0, 295.0, 295.0, 295.0, 3.389830508474576, 223.25873940677968, 4.803363347457627], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-24", 1, 0, 0.0, 192.0, 192, 192, 192.0, 192.0, 192.0, 192.0, 5.208333333333333, 9.745279947916666, 7.1868896484375], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-25", 1, 0, 0.0, 202.0, 202, 202, 202.0, 202.0, 202.0, 202.0, 4.9504950495049505, 17.65064201732673, 6.860109839108911], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-8", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 8.909563785347043, 3.5070894922879177], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-9", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 17.908732096354168, 3.5527547200520835], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-4", 1, 0, 0.0, 264.0, 264, 264, 264.0, 264.0, 264.0, 264.0, 3.787878787878788, 379.3390447443182, 2.016009706439394], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en", 1, 0, 0.0, 4948.0, 4948, 4948, 4948.0, 4948.0, 4948.0, 4948.0, 0.2021018593371059, 383.1525600621463, 8.780575800828617], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-5", 1, 0, 0.0, 727.0, 727, 727, 727.0, 727.0, 727.0, 727.0, 1.375515818431912, 45.14620228679505, 1.8792447558459422], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-6", 1, 0, 0.0, 122.0, 122, 122, 122.0, 122.0, 122.0, 122.0, 8.196721311475411, 133.7650486680328, 4.594646516393443], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-7", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 161.4606836642599, 2.497814192238267], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-15", 1, 0, 0.0, 497.0, 497, 497, 497.0, 497.0, 497.0, 497.0, 2.012072434607646, 103.79464285714286, 2.796073314889336], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-16", 1, 0, 0.0, 93.0, 93, 93, 93.0, 93.0, 93.0, 93.0, 10.752688172043012, 474.3258568548387, 9.450604838709678], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-17", 1, 0, 0.0, 998.0, 998, 998, 998.0, 998.0, 998.0, 998.0, 1.002004008016032, 92.84682646543087, 1.4354881638276553], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-18", 1, 0, 0.0, 2358.0, 2358, 2358, 2358.0, 2358.0, 2358.0, 2358.0, 0.42408821034775235, 53.16964522370653, 0.6067277618744699], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-19", 1, 0, 0.0, 902.0, 902, 902, 902.0, 902.0, 902.0, 902.0, 1.1086474501108647, 155.96092883869179, 1.5882673919068735], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-0", 28, 0, 0.0, 135.57142857142858, 74, 1220, 77.0, 315.6, 815.4499999999974, 1220.0, 6.58513640639699, 67.66760495061148, 5.516246031279398], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-1", 28, 0, 0.0, 468.8571428571428, 116, 2282, 341.0, 963.2000000000006, 1855.3999999999974, 2282.0, 7.858546168958742, 235.01882411240527, 4.448114738282346], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-30", 1, 0, 0.0, 272.0, 272, 272, 272.0, 272.0, 272.0, 272.0, 3.676470588235294, 4.451976102941176, 5.073098575367647], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-2", 1, 0, 0.0, 175.0, 175, 175, 175.0, 175.0, 175.0, 175.0, 5.714285714285714, 525.1953125, 3.0245535714285716], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-31", 1, 0, 0.0, 193.0, 193, 193, 193.0, 193.0, 193.0, 193.0, 5.181347150259067, 151.9996761658031, 2.7475307642487046], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-3", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 8.182612728310502, 2.079468702435312], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-10", 1, 0, 0.0, 451.0, 451, 451, 451.0, 451.0, 451.0, 451.0, 2.2172949002217295, 64.32537070399113, 3.1245669345898004], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-32", 1, 0, 0.0, 50.0, 50, 50, 50.0, 50.0, 50.0, 50.0, 20.0, 677.734375, 11.171875], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-11", 1, 0, 0.0, 422.0, 422, 422, 422.0, 422.0, 422.0, 422.0, 2.3696682464454977, 2.9389440165876777, 3.2050688684834125], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-33", 1, 0, 0.0, 74.0, 74, 74, 74.0, 74.0, 74.0, 74.0, 13.513513513513514, 3029.151710304054, 7.218644425675676], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-12", 1, 0, 0.0, 81.0, 81, 81, 81.0, 81.0, 81.0, 81.0, 12.345679012345679, 102.90075231481481, 10.537229938271604], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-34", 1, 0, 0.0, 234.0, 234, 234, 234.0, 234.0, 234.0, 234.0, 4.273504273504274, 27.610844017094017, 5.930321848290598], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-13", 1, 0, 0.0, 382.0, 382, 382, 382.0, 382.0, 382.0, 382.0, 2.617801047120419, 3.6787262761780104, 3.648048920157068], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-35", 1, 0, 0.0, 383.0, 383, 383, 383.0, 383.0, 383.0, 383.0, 2.6109660574412534, 12.68256364229765, 3.587528557441253], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-14", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 42.35055905963303, 6.446208428899083], "isController": false}, {"data": ["https://eticket.railway.gov.bd/en-36", 1, 0, 0.0, 523.0, 523, 523, 523.0, 523.0, 523.0, 523.0, 1.9120458891013383, 429.38500836520075, 0.9933675908221797], "isController": false}, {"data": ["https://eticket.railway.gov.bd/booking/train/search-route?fromcity=Dhaka&tocity=Chattogram&doj=17-Apr-2023&class=AC_CHAIR", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 2.53398001858736, 2.9079054368029738], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 93, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
