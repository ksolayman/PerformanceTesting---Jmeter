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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8563953488372092, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "mac-278"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-389"], "isController": false}, {"data": [1.0, 500, 1500, "mac-277"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-388"], "isController": false}, {"data": [0.9, 500, 1500, "store-121"], "isController": false}, {"data": [1.0, 500, 1500, "store-122"], "isController": false}, {"data": [1.0, 500, 1500, "mac-279"], "isController": false}, {"data": [1.0, 500, 1500, "mac-274"], "isController": false}, {"data": [1.0, 500, 1500, "store-120"], "isController": false}, {"data": [1.0, 500, 1500, "mac-276"], "isController": false}, {"data": [1.0, 500, 1500, "mac-275"], "isController": false}, {"data": [0.65, 500, 1500, "home-46"], "isController": false}, {"data": [0.45, 500, 1500, "home-47"], "isController": false}, {"data": [0.3, 500, 1500, "home-48"], "isController": false}, {"data": [0.75, 500, 1500, "store-135-2"], "isController": false}, {"data": [0.2, 500, 1500, "home-49"], "isController": false}, {"data": [0.9, 500, 1500, "store-135-1"], "isController": false}, {"data": [0.65, 500, 1500, "store-135-0"], "isController": false}, {"data": [0.95, 500, 1500, "mac-270"], "isController": false}, {"data": [1.0, 500, 1500, "mac-272"], "isController": false}, {"data": [1.0, 500, 1500, "mac-271"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-387"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-386"], "isController": false}, {"data": [1.0, 500, 1500, "store-134"], "isController": false}, {"data": [0.1, 500, 1500, "store-135"], "isController": false}, {"data": [1.0, 500, 1500, "mac-288"], "isController": false}, {"data": [1.0, 500, 1500, "store-132"], "isController": false}, {"data": [1.0, 500, 1500, "store-133"], "isController": false}, {"data": [0.95, 500, 1500, "mac-246"], "isController": false}, {"data": [1.0, 500, 1500, "store-130"], "isController": false}, {"data": [1.0, 500, 1500, "store-131"], "isController": false}, {"data": [1.0, 500, 1500, "mac-284"], "isController": false}, {"data": [1.0, 500, 1500, "mac-287"], "isController": false}, {"data": [0.95, 500, 1500, "home-30"], "isController": false}, {"data": [1.0, 500, 1500, "store-138"], "isController": false}, {"data": [0.95, 500, 1500, "store-137"], "isController": false}, {"data": [0.95, 500, 1500, "home-35"], "isController": false}, {"data": [1.0, 500, 1500, "mac-281"], "isController": false}, {"data": [1.0, 500, 1500, "mac-280"], "isController": false}, {"data": [1.0, 500, 1500, "mac-283"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-372"], "isController": false}, {"data": [1.0, 500, 1500, "mac-282"], "isController": false}, {"data": [0.5, 500, 1500, "ipad"], "isController": true}, {"data": [1.0, 500, 1500, "ipad-400"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-402"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-401"], "isController": false}, {"data": [1.0, 500, 1500, "mac-296"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-404"], "isController": false}, {"data": [1.0, 500, 1500, "mac-295"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-403"], "isController": false}, {"data": [1.0, 500, 1500, "home-60"], "isController": false}, {"data": [0.95, 500, 1500, "home-61"], "isController": false}, {"data": [1.0, 500, 1500, "home-62"], "isController": false}, {"data": [1.0, 500, 1500, "home-63"], "isController": false}, {"data": [1.0, 500, 1500, "home-64"], "isController": false}, {"data": [1.0, 500, 1500, "home-65"], "isController": false}, {"data": [1.0, 500, 1500, "home-66"], "isController": false}, {"data": [0.0, 500, 1500, "mac"], "isController": true}, {"data": [1.0, 500, 1500, "home-67"], "isController": false}, {"data": [1.0, 500, 1500, "home-68"], "isController": false}, {"data": [1.0, 500, 1500, "mac-292"], "isController": false}, {"data": [1.0, 500, 1500, "mac-294"], "isController": false}, {"data": [1.0, 500, 1500, "mac-293"], "isController": false}, {"data": [0.55, 500, 1500, "store-94"], "isController": false}, {"data": [0.55, 500, 1500, "mac-267"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-399"], "isController": false}, {"data": [1.0, 500, 1500, "store-110"], "isController": false}, {"data": [0.45, 500, 1500, "store-111"], "isController": false}, {"data": [1.0, 500, 1500, "mac-265"], "isController": false}, {"data": [1.0, 500, 1500, "mac-264"], "isController": false}, {"data": [0.25, 500, 1500, "home-50"], "isController": false}, {"data": [0.85, 500, 1500, "home-51"], "isController": false}, {"data": [0.9, 500, 1500, "store-119"], "isController": false}, {"data": [0.0, 500, 1500, "store"], "isController": true}, {"data": [0.2, 500, 1500, "home-52"], "isController": false}, {"data": [0.9, 500, 1500, "home-53"], "isController": false}, {"data": [0.85, 500, 1500, "home-54"], "isController": false}, {"data": [0.3, 500, 1500, "home-55"], "isController": false}, {"data": [0.9, 500, 1500, "home-56"], "isController": false}, {"data": [0.0, 500, 1500, "home"], "isController": true}, {"data": [0.9, 500, 1500, "home-57"], "isController": false}, {"data": [0.95, 500, 1500, "home-58"], "isController": false}, {"data": [1.0, 500, 1500, "home-59"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-390"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-394"], "isController": false}, {"data": [1.0, 500, 1500, "ipad-395"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 820, 0, 0.0, 360.68902439024424, 57, 14487, 75.0, 1018.4999999999999, 1508.8499999999972, 4263.879999999994, 22.585176412262097, 584.5768969740683, 16.034593019252483], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["mac-278", 10, 0, 0.0, 74.89999999999999, 67, 91, 74.5, 89.60000000000001, 91.0, 91.0, 0.873743993010048, 1.2294704292267364, 0.6356828855395369], "isController": false}, {"data": ["ipad-389", 10, 0, 0.0, 74.8, 65, 91, 72.0, 90.9, 91.0, 91.0, 0.8975854950184006, 1.3732006215779553, 0.6503988645543488], "isController": false}, {"data": ["mac-277", 10, 0, 0.0, 71.0, 65, 76, 71.5, 75.9, 76.0, 76.0, 0.873743993010048, 1.1868924748798602, 0.6339763543031891], "isController": false}, {"data": ["ipad-388", 10, 0, 0.0, 76.2, 65, 97, 73.0, 96.3, 97.0, 97.0, 0.8958165367732689, 1.4482658951446743, 0.6491170608259428], "isController": false}, {"data": ["store-121", 10, 0, 0.0, 228.50000000000003, 66, 809, 82.5, 786.4000000000001, 809.0, 809.0, 6.39386189258312, 34.26085957480818, 3.1095148657289], "isController": false}, {"data": ["store-122", 10, 0, 0.0, 146.1, 63, 477, 73.5, 466.6, 477.0, 477.0, 6.784260515603799, 26.752777306648575, 3.2861261872455905], "isController": false}, {"data": ["mac-279", 10, 0, 0.0, 70.5, 66, 76, 70.0, 75.9, 76.0, 76.0, 0.8733624454148472, 1.3659081604803494, 0.632846615720524], "isController": false}, {"data": ["mac-274", 10, 0, 0.0, 70.8, 67, 79, 69.0, 78.6, 79.0, 79.0, 0.8523695874531196, 1.480825679764746, 0.5418873060859188], "isController": false}, {"data": ["store-120", 10, 0, 0.0, 181.6, 74, 465, 93.0, 458.0, 465.0, 465.0, 5.753739930955121, 23.312198827675488, 2.80944332566168], "isController": false}, {"data": ["mac-276", 10, 0, 0.0, 102.80000000000001, 65, 363, 74.0, 335.80000000000007, 363.0, 363.0, 0.851861316977596, 1.2317049471845982, 0.6330727170116704], "isController": false}, {"data": ["mac-275", 10, 0, 0.0, 73.39999999999999, 67, 80, 74.5, 79.6, 80.0, 80.0, 0.8521516829995739, 1.3290736844908395, 0.5592245419684704], "isController": false}, {"data": ["home-46", 10, 0, 0.0, 1309.8, 314, 4757, 542.0, 4651.0, 4757.0, 4757.0, 1.461988304093567, 1.8316257766812867, 0.9180258589181287], "isController": false}, {"data": ["home-47", 10, 0, 0.0, 1146.9, 545, 2482, 1112.5, 2374.5000000000005, 2482.0, 2482.0, 1.273560876209883, 275.67369380412634, 0.9290527095007641], "isController": false}, {"data": ["home-48", 10, 0, 0.0, 1949.1000000000001, 1082, 4818, 1238.0, 4695.200000000001, 4818.0, 4818.0, 1.1788282447247436, 270.9681771631498, 0.8610971943887775], "isController": false}, {"data": ["store-135-2", 10, 0, 0.0, 745.0, 139, 1468, 437.0, 1465.1, 1468.0, 1468.0, 1.9470404984423677, 53.985880914135514, 1.450773340147975], "isController": false}, {"data": ["home-49", 10, 0, 0.0, 2097.2, 697, 4128, 1764.5, 4086.5, 4128.0, 4128.0, 0.900657479960371, 204.2020948730073, 0.6631794334864451], "isController": false}, {"data": ["store-135-1", 10, 0, 0.0, 297.70000000000005, 80, 526, 226.5, 524.0, 526.0, 526.0, 2.31000231000231, 2.003205128205128, 1.7460369022869024], "isController": false}, {"data": ["store-135-0", 10, 0, 0.0, 1160.1999999999998, 329, 4412, 985.0, 4109.000000000001, 4412.0, 4412.0, 2.1710811984368217, 3.331252713851498, 1.1406657077724707], "isController": false}, {"data": ["mac-270", 10, 0, 0.0, 122.3, 65, 588, 72.5, 536.7000000000002, 588.0, 588.0, 0.8405480373203329, 1.2934917941497857, 0.61153153105825], "isController": false}, {"data": ["mac-272", 10, 0, 0.0, 70.1, 64, 73, 71.0, 73.0, 73.0, 73.0, 0.8398421096833795, 1.2179350907029478, 0.6085574661963551], "isController": false}, {"data": ["mac-271", 10, 0, 0.0, 150.1, 65, 485, 73.5, 480.6, 485.0, 485.0, 0.8402655239055541, 1.714174491639358, 0.6121465633140072], "isController": false}, {"data": ["ipad-387", 10, 0, 0.0, 75.89999999999999, 66, 92, 74.0, 91.4, 92.0, 92.0, 0.8962982880702698, 1.2692599096979476, 0.6529673075199426], "isController": false}, {"data": ["ipad-386", 10, 0, 0.0, 76.39999999999999, 65, 92, 74.0, 91.8, 92.0, 92.0, 0.8952551477170994, 1.3469043755595345, 0.65220736347359], "isController": false}, {"data": ["store-134", 10, 0, 0.0, 70.1, 58, 91, 68.0, 89.60000000000001, 91.0, 91.0, 15.600624024960998, 22.654421801872076, 8.303066497659906], "isController": false}, {"data": ["store-135", 10, 0, 0.0, 2204.8, 1307, 5822, 1832.5, 5470.600000000001, 5822.0, 5822.0, 1.6622340425531914, 50.08096897855718, 3.368296521775266], "isController": false}, {"data": ["mac-288", 10, 0, 0.0, 74.30000000000001, 64, 97, 73.0, 95.0, 97.0, 97.0, 0.897021887334051, 1.3098797149712953, 0.6175785454790097], "isController": false}, {"data": ["store-132", 10, 0, 0.0, 111.69999999999999, 58, 500, 68.5, 457.60000000000014, 500.0, 500.0, 9.389671361502348, 18.871038732394368, 5.089128521126761], "isController": false}, {"data": ["store-133", 10, 0, 0.0, 68.6, 57, 89, 67.5, 87.60000000000001, 89.0, 89.0, 15.847860538827259, 29.320089639461173, 8.573940174326466], "isController": false}, {"data": ["mac-246", 10, 0, 0.0, 221.5, 127, 709, 171.5, 660.1000000000001, 709.0, 709.0, 0.8311861025683651, 19.208759532665614, 0.6071554733604854], "isController": false}, {"data": ["store-130", 10, 0, 0.0, 78.1, 62, 154, 68.0, 146.60000000000002, 154.0, 154.0, 9.40733772342427, 18.702595837253057, 4.740416274694262], "isController": false}, {"data": ["store-131", 10, 0, 0.0, 73.40000000000002, 63, 114, 69.0, 110.10000000000002, 114.0, 114.0, 9.37207122774133, 13.372591084817245, 4.759254920337395], "isController": false}, {"data": ["mac-284", 10, 0, 0.0, 72.0, 65, 79, 72.0, 78.8, 79.0, 79.0, 0.897021887334051, 2.1854396528525295, 0.6508664670792967], "isController": false}, {"data": ["mac-287", 10, 0, 0.0, 70.0, 65, 74, 69.0, 74.0, 74.0, 74.0, 0.8971828458639871, 1.2097073782074286, 0.6185655167773192], "isController": false}, {"data": ["home-30", 10, 0, 0.0, 187.1, 93, 725, 100.0, 686.8000000000002, 725.0, 725.0, 1.779359430604982, 31.36120996441281, 1.2146213300711743], "isController": false}, {"data": ["store-138", 10, 0, 0.0, 75.9, 66, 111, 72.5, 107.60000000000001, 111.0, 111.0, 2.012477359629704, 4.4985944103441335, 1.5368723586234654], "isController": false}, {"data": ["store-137", 10, 0, 0.0, 161.4, 88, 744, 98.0, 680.0000000000002, 744.0, 744.0, 2.000400080016003, 55.042258451690344, 1.4905324814962995], "isController": false}, {"data": ["home-35", 10, 0, 0.0, 172.6, 67, 777, 77.5, 731.3000000000002, 777.0, 777.0, 1.5870496746548166, 3.6545538406602125, 1.035301936200603], "isController": false}, {"data": ["mac-281", 10, 0, 0.0, 73.7, 66, 101, 70.5, 98.5, 101.0, 101.0, 0.8734387282732117, 1.2700686195300899, 0.633754858502926], "isController": false}, {"data": ["mac-280", 10, 0, 0.0, 70.39999999999999, 65, 74, 70.5, 74.0, 74.0, 74.0, 0.8731336767659128, 1.2934997926307519, 0.6360915262376671], "isController": false}, {"data": ["mac-283", 10, 0, 0.0, 101.69999999999999, 68, 362, 73.5, 334.0000000000001, 362.0, 362.0, 0.8744316194473593, 1.6410963732948582, 0.6327674121196223], "isController": false}, {"data": ["ipad-372", 10, 0, 0.0, 130.6, 105, 171, 125.5, 171.0, 171.0, 171.0, 0.893415527561869, 16.777453681988742, 0.652612123648709], "isController": false}, {"data": ["mac-282", 10, 0, 0.0, 71.7, 65, 87, 71.0, 85.7, 87.0, 87.0, 0.8730574471800244, 1.2563842325825039, 0.639446372446307], "isController": false}, {"data": ["ipad", 10, 0, 0.0, 1125.9000000000003, 988, 1407, 1105.5, 1390.4, 1407.0, 1407.0, 0.8235197232973729, 31.838205396112986, 8.239218325372642], "isController": true}, {"data": ["ipad-400", 10, 0, 0.0, 70.5, 65, 76, 70.0, 75.9, 76.0, 76.0, 0.9231053263177328, 1.2611565932797932, 0.6679893035170312], "isController": false}, {"data": ["ipad-402", 10, 0, 0.0, 77.2, 66, 112, 71.5, 110.4, 112.0, 112.0, 0.9225943352707814, 1.3537089733831533, 0.6685205046591014], "isController": false}, {"data": ["ipad-401", 10, 0, 0.0, 83.9, 65, 161, 73.0, 155.50000000000003, 161.0, 161.0, 0.9228497600590624, 1.461779600406054, 0.6651007059800664], "isController": false}, {"data": ["mac-296", 10, 0, 0.0, 74.60000000000001, 65, 101, 70.0, 99.5, 101.0, 101.0, 0.8971023593792052, 1.3027257894500763, 0.6859679173768727], "isController": false}, {"data": ["ipad-404", 10, 0, 0.0, 74.9, 67, 89, 74.0, 88.2, 89.0, 89.0, 0.9245562130177515, 1.3109918176775146, 0.6103515625], "isController": false}, {"data": ["mac-295", 10, 0, 0.0, 72.5, 67, 83, 71.0, 82.4, 83.0, 83.0, 0.896941429724639, 1.9646871356175444, 0.6937281370526505], "isController": false}, {"data": ["ipad-403", 10, 0, 0.0, 69.2, 65, 73, 68.5, 73.0, 73.0, 73.0, 0.9248127254231018, 1.2466005907241282, 0.6114240381947655], "isController": false}, {"data": ["home-60", 10, 0, 0.0, 75.2, 64, 113, 71.5, 109.4, 113.0, 113.0, 0.7000350017500875, 1.3074384187959398, 0.5414333216660833], "isController": false}, {"data": ["home-61", 10, 0, 0.0, 158.5, 69, 790, 73.0, 728.6000000000003, 790.0, 790.0, 0.8150623522699486, 1.4900358627435, 0.6296038287553998], "isController": false}, {"data": ["home-62", 10, 0, 0.0, 84.9, 65, 139, 72.0, 138.6, 139.0, 139.0, 0.8385041086701325, 1.709762284085192, 0.6493493732181788], "isController": false}, {"data": ["home-63", 10, 0, 0.0, 125.69999999999999, 65, 457, 70.0, 432.6000000000001, 457.0, 457.0, 0.8382932349735938, 1.836222388716573, 0.6483674239248889], "isController": false}, {"data": ["home-64", 10, 0, 0.0, 96.4, 65, 317, 72.5, 293.5000000000001, 317.0, 317.0, 0.8381527114240215, 1.9635200580420753, 0.6523512802782667], "isController": false}, {"data": ["home-65", 10, 0, 0.0, 70.2, 64, 74, 70.0, 73.9, 74.0, 74.0, 0.8379420144126026, 1.8460910005027653, 0.6521872905144964], "isController": false}, {"data": ["home-66", 10, 0, 0.0, 99.09999999999998, 64, 325, 69.5, 301.80000000000007, 325.0, 325.0, 0.8376612497905846, 1.6835027852236555, 0.6486966514491539], "isController": false}, {"data": ["mac", 10, 0, 0.0, 3215.2, 2634, 4023, 3079.0, 4011.1, 4023.0, 4023.0, 0.6883259911894274, 201.31290116499173, 12.446332082874449], "isController": true}, {"data": ["home-67", 10, 0, 0.0, 91.99999999999999, 64, 300, 69.5, 277.30000000000007, 300.0, 300.0, 0.8374507997655138, 1.1621265492839794, 0.6428089146637634], "isController": false}, {"data": ["home-68", 10, 0, 0.0, 72.3, 65, 81, 72.0, 80.5, 81.0, 81.0, 0.8373105584861424, 1.2158992192079043, 0.6402482102486813], "isController": false}, {"data": ["mac-292", 10, 0, 0.0, 73.0, 65, 102, 70.0, 99.20000000000002, 102.0, 102.0, 0.897021887334051, 1.8509836405633298, 0.6929143680480804], "isController": false}, {"data": ["mac-294", 10, 0, 0.0, 70.4, 65, 75, 69.5, 75.0, 75.0, 75.0, 0.896941429724639, 1.6751957854964572, 0.6937281370526505], "isController": false}, {"data": ["mac-293", 10, 0, 0.0, 71.60000000000001, 66, 79, 71.0, 78.7, 79.0, 79.0, 0.8968609865470852, 1.5960447029147982, 0.6919142376681614], "isController": false}, {"data": ["store-94", 10, 0, 0.0, 911.1999999999999, 271, 1919, 843.5, 1871.2000000000003, 1919.0, 1919.0, 3.1806615776081424, 66.43979604007633, 1.5654818702290076], "isController": false}, {"data": ["mac-267", 10, 0, 0.0, 818.8000000000001, 420, 1426, 716.5, 1416.7, 1426.0, 1426.0, 0.8082114281095935, 178.5728943566637, 0.5880053847086398], "isController": false}, {"data": ["ipad-399", 10, 0, 0.0, 72.19999999999999, 66, 80, 72.5, 79.8, 80.0, 80.0, 0.9234463015975621, 1.2877747252747251, 0.6682360444177671], "isController": false}, {"data": ["store-110", 10, 0, 0.0, 164.4, 68, 433, 91.0, 424.3, 433.0, 433.0, 4.11522633744856, 51.01433899176954, 2.05761316872428], "isController": false}, {"data": ["store-111", 10, 0, 0.0, 1084.6999999999998, 448, 2757, 760.0, 2658.3, 2757.0, 2757.0, 3.5688793718772303, 821.9122222965739, 1.7704987508922199], "isController": false}, {"data": ["mac-265", 10, 0, 0.0, 107.8, 93, 140, 103.0, 138.4, 140.0, 140.0, 0.8386447500838644, 10.244733573045957, 0.6117847932740691], "isController": false}, {"data": ["mac-264", 10, 0, 0.0, 365.3, 321, 415, 373.0, 412.1, 415.0, 415.0, 0.8223684210526315, 1.0215357730263157, 0.5196019222861842], "isController": false}, {"data": ["home-50", 10, 0, 0.0, 1822.6999999999998, 917, 4300, 1548.5, 4112.6, 4300.0, 4300.0, 0.862738331464067, 182.60985759425418, 0.6344159800707446], "isController": false}, {"data": ["home-51", 10, 0, 0.0, 347.7, 78, 909, 287.0, 884.0000000000001, 909.0, 909.0, 1.4900908955446281, 17.94220775592311, 1.0899200007450454], "isController": false}, {"data": ["store-119", 10, 0, 0.0, 293.1, 68, 1163, 132.5, 1096.9, 1163.0, 1163.0, 4.677268475210477, 26.387285137979422, 2.2929577876520115], "isController": false}, {"data": ["store", 10, 0, 0.0, 5853.6, 4867, 9068, 5496.5, 8793.300000000001, 9068.0, 9068.0, 0.9206407659731173, 323.3167198432609, 8.837791728042717], "isController": true}, {"data": ["home-52", 10, 0, 0.0, 2440.3, 938, 4644, 2569.5, 4529.400000000001, 4644.0, 4644.0, 0.968147933004163, 220.96274748281536, 0.7034199825733372], "isController": false}, {"data": ["home-53", 10, 0, 0.0, 282.9, 73, 1266, 83.0, 1206.1000000000004, 1266.0, 1266.0, 1.027643613194944, 1.614624813739595, 0.6703768882951393], "isController": false}, {"data": ["home-54", 10, 0, 0.0, 381.2, 102, 1159, 279.0, 1100.6000000000004, 1159.0, 1159.0, 1.00150225338007, 12.595064471707563, 0.7296100400600902], "isController": false}, {"data": ["home-55", 10, 0, 0.0, 2166.6, 561, 7876, 1006.5, 7498.700000000001, 7876.0, 7876.0, 0.6549217368524461, 147.4303020007859, 0.4796790064837252], "isController": false}, {"data": ["home-56", 10, 0, 0.0, 233.4, 74, 657, 98.0, 655.3, 657.0, 657.0, 0.6905123601712471, 1.1301745269990333, 0.5293478542328408], "isController": false}, {"data": ["home", 10, 0, 0.0, 17178.9, 9976, 26743, 16411.5, 26078.300000000003, 26743.0, 26743.0, 0.37392962644430316, 527.2331048078001, 6.919158751822907], "isController": true}, {"data": ["home-57", 10, 0, 0.0, 1555.6000000000001, 65, 14487, 75.0, 13086.200000000004, 14487.0, 14487.0, 0.6901311249137336, 1.2121775793650793, 0.5317514233954451], "isController": false}, {"data": ["home-58", 10, 0, 0.0, 133.2, 65, 657, 74.0, 600.8000000000002, 657.0, 657.0, 1.4509576320371445, 2.9940170668891466, 1.1208080927161925], "isController": false}, {"data": ["home-59", 10, 0, 0.0, 78.3, 64, 130, 73.0, 125.30000000000001, 130.0, 130.0, 1.4486455164421266, 2.5778533789656675, 1.1176073808489064], "isController": false}, {"data": ["ipad-390", 10, 0, 0.0, 71.8, 65, 80, 71.5, 79.5, 80.0, 80.0, 0.8979885057471264, 1.939006235407687, 0.6489370061063219], "isController": false}, {"data": ["ipad-394", 10, 0, 0.0, 100.60000000000001, 66, 366, 69.5, 337.3000000000001, 366.0, 366.0, 0.8990380293086397, 1.1901718286433516, 0.6347700148341275], "isController": false}, {"data": ["ipad-395", 10, 0, 0.0, 71.69999999999999, 65, 78, 71.5, 77.7, 78.0, 78.0, 0.8990380293086397, 1.5768284185921067, 0.6523293513440619], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 820, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
