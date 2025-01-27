// SPDX-License-Identifier: GPL-3.0-only.
// SPDX-FileCopyrightText: 2025 International Committee of the Red Cross.
//
// This software is licensed under GPL v3.0 license.
// See LICENSE file at the root of the project.

// Holds results for all targets.
let results = {};

// Holds data that will be displayed in targettable.
let targets = [];

// Holds the selected item in targettable.
let target = "";

// Holds the licenseInfos for selected target.
let licenseInfos = [];

// Create licensetable with buttons and pagination
// This will show the package names and license information.
const licensetable = $("#licensetable").DataTable({
  mark: true,
  dom: "Brtip",
  lengthMenu: [
    [10, 25, 50, 100, -1],
    ["10 rows", "25 rows", "50 rows", "100 rows", "Show All"],
  ],
  buttons: [
    "pageLength",
    {
      extend: "copyHtml5",
      exportOptions: {
        columns: ":visible",
      },
    },
    {
      extend: "excelHtml5",
      exportOptions: {
        columns: ":visible",
      },
    },
    {
      extend: "csvHtml5",
      exportOptions: {
        columns: ":visible",
      },
    },
    {
      extend: "print",
      exportOptions: {
        columns: ":visible",
      },
    },
    {
      extend: "pdfHtml5",
      download: "open",
      exportOptions: {
        columns: ":visible",
      },
    },
  ],
  columns: [{ data: "name" }, { data: "license" }],
  drawCallback: function () {
    var api = this.api();
    var rowCount = api.rows({ page: "current" }).count();

    for (var i = 0; i < api.page.len() - (rowCount === 0 ? 1 : rowCount); i++) {
      $("#licensetable tbody").append($("<tr ><td>&nbsp;</td><td></td></tr>"));
    }
  },
});

// Create search field at the bottom of each column in licensetable.
$("#licensetable tfoot th").each(function () {
  var title = $("#licensetable tfoot th").eq($(this).index()).text();
  $(this).html('<input type="text" placeholder="Search ' + title + '" />');
});

// Add event listener for search inputs for licensetable.
// Enables filtering packages.
licensetable
  .columns()
  .eq(0)
  .each(function (colIdx) {
    $("input", licensetable.column(colIdx).footer()).on(
      "keyup change",
      function () {
        licensetable.column(colIdx).search(this.value).draw();
      }
    );
  });

// Create filetable with pagination.
// This will fetch the scan results from /api/results endpoint.
const filetable = $("#filetable").DataTable({
  mark: true,
  select: true,
  dom: "rtip",
  pageLength: 6,
  ajax: { url: "/api/results", dataSrc: "" },
  columns: [{ data: "name" }],
});

// Add event listener to filetable that will update targettable
// when a user selects a scan result.
filetable.on("click", "tbody tr", function (e) {
  let classList = e.currentTarget.classList;

  licensetable.clear().draw();

  if (classList.contains("selected")) {
    classList.remove("selected");
    targettable.clear().draw();
  } else {
    filetable
      .rows(".selected")
      .nodes()
      .each((row) => row.classList.remove("selected"));
    classList.add("selected");

    let result = filetable.row(this).data();
    // Download file from /results directory
    $.getJSON("/results/" + result.name, function (data) {
      // Typically, data will have the following structure:
      // {
      //   "version": "1.0",
      //   "scannedAt": "2025-01-24T00:18:04",
      //   "results": {
      //     "localhost": {
      //       "Box2D": "Zlib",
      //       "zxcvbn-c": "MIT",
      //       "zxing-cpp": "Apache-2.0 AND MIT"
      //     }
      //   }
      // }

      results = data["results"];
      targets = [];

      // Copy values in packages into targets so that targettable can use.
      // Note that Datatables accepts only key-value pairs.
      for (var key in results) {
        var entry = { name: key };
        targets.push(entry);
      }

      // Update the table: remove old data, set new data and draw.
      targettable.clear();
      targettable.rows.add(targets);
      targettable.draw();
    }).fail(function () {
      console.log("Error while reading input.");
    });
  }
});

// Create search field at the bottom of each column in filetable.
$("#filetable tfoot th").each(function () {
  var title = $("#filetable tfoot th").eq($(this).index()).text();
  $(this).html('<input type="text" placeholder="Search ' + title + '" />');
});

// Add event listener for search inputs for filetable.
// Enables filtering results.
filetable
  .columns()
  .eq(0)
  .each(function (colIdx) {
    $("input", filetable.column(colIdx).footer()).on(
      "keyup change",
      function () {
        filetable.column(colIdx).search(this.value).draw();
      }
    );
  });

// Create targettable with pagination.
// When user clicks a row in targettable, we will update licensetable
// with corresponding package and license information.
const targettable = $("#targettable").DataTable({
  mark: true,
  select: true,
  dom: "rtip",
  pageLength: 6,
  columns: [{ data: "name" }],
});

// Add event listener to targettable that will update licensetable
// when a user selects a scan result.
targettable.on("click", "tbody tr", function (e) {
  let classList = e.currentTarget.classList;

  if (classList.contains("selected")) {
    classList.remove("selected");
    licensetable.clear().draw();
  } else {
    targettable
      .rows(".selected")
      .nodes()
      .each((row) => row.classList.remove("selected"));
    classList.add("selected");

    target = targettable.row(this).data().name;
    licenseInfos = [];

    for (var pkg in results[target]) {
      var entry = { name: pkg, license: results[target][pkg] };
      licenseInfos.push(entry);
    }

    // Update the table: remove old data, set new data and draw.
    licensetable.clear();
    licensetable.rows.add(licenseInfos);
    licensetable.draw();
  }
});

// Create search field at the bottom of each column in targettable.
$("#targettable tfoot th").each(function () {
  var title = $("#targettable tfoot th").eq($(this).index()).text();
  $(this).html('<input type="text" placeholder="Search ' + title + '" />');
});

// Add event listener for search inputs for targettable.
// Enables filtering results.
targettable
  .columns()
  .eq(0)
  .each(function (colIdx) {
    $("input", targettable.column(colIdx).footer()).on(
      "keyup change",
      function () {
        targettable.column(colIdx).search(this.value).draw();
      }
    );
  });
