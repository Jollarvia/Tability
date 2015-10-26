var tability = function (r, c, b, a) {
    "use strict";
    this.tableAttrs = null;
    this.columns = [];
    this.sort = {
        custom: this._custom,
        numeric: {
            _parent: this,
            ascending: this._numericAscending,
            descending: this._numericDescending
        },
        lexical: {
            _parent: this,
            ascending: this._lexAscending,
            descending: this._lexDescending
        },
        datetime: {
            _parent: this,
            ascending: this._dateAscending,
            descending: this._dateDescending
        }
    };
    this.beforeBuild = b;
    this.afterBuild = a;
    if (!c) {
        if (r&&r[0]){

            var header = r[0];
            r.splice(0,1);
            c = header;
	    }
    }
    this.rows = !r?[]:r;
    this.visibleRows = this.rows;
    if(!c) return;
    var clength = c.length;

    for (var n = 0; n < clength; n++) {
        var col = c[n];
        var ty = typeof col;
        switch (ty) {
            case "string":
                this.columns.push({ "key": col });
                break;
            case "object":
                this.columns.push(col);
                break;
            default:
                throw "column number " + n + " is wrong type.";
        }
    }
}
tability.prototype.standardAttrs = function (c, s) {
    var r = {};
    if (c) r["className"] = c;
    if (s) r["style"] = s;
    return r;
}
tability.prototype.getAttrs = function (op) {
    var r = {};
    for (var o in op) {
        if (o != "key" && (op[o])) r[o] = op[o];
    }
    return r;
}


//columns
tability.prototype.containsColumn = function (col) {
    for (var o = 0,y=this.columns.length; o < y; o++) {
        if (this.columns[o].key === col) return true;
    }
    return false;
}
tability.prototype.columnIndex = function (col) {
    var clength = this.columnCount();
    for (var o = 0; o < clength; o++) {
        if (this.columns[o].key === col) {
            return o;
        }
    }
    return -1;
}
tability.prototype.addColumn = function (keyandattrs) {
    var ty = typeof keyandattrs;
    var k;
    switch (ty){
        case "string":
            k = {"key":keyandattrs};
            break;
        case "object":
            k = keyandattrs;
            break;
        default: throw "invalid column type."
    }
    if (this.containsColumn(k)) return false;
    this.columns.push(k);
    return true;
}
tability.prototype._insertColumn = function (keyandattrs, index) {
    var ty = typeof keyandattrs;
    var k;
    switch (ty){
        case "object":
            k = keyandattrs;
            break;
        case "array":
            throw "invalid column type."
            break;
        default:
            k = {"key":keyandattrs};
            break;
    }
    if (this.containsColumn(k)) return false;
    this.columns.splice(index, 0, k);
    return true;
}
tability.prototype.insertColumn = function (keyandattrs,index) {
    if (this._insertColumn(keyandattrs,index)) {
        for (var i=0,m=this.rowCount();i<m;i++) {
            this.insertNumRowValue(index,null,i);
        }
        return true;
    }
    return false;
}
tability.prototype.columnCount = function () {
    return this.columns.length;
}
tability.prototype.makeColumnAttrs = function (span, border, background, width, visibility) {
    var r = {};
    if (span) r["span"] = span.toString();
    if (border) r["border"] = border;
    if (background) r["background"] = background;
    if (width) r["width"] = width;
    if (visibility) r["visibility"] = visibility;
    return r;
}
tability.prototype.getAllColumnAttrs = function () {
    return this.columns.map(function (c, i, a) { return (c.attrs) ? c.attrs : null });
}
tability.prototype.getColumnAttrs = function (colNum) {
    return this.columns[colNum].attrs;
}
tability.prototype.getColumnNames = function () {
    return this.columns.map(function (c, i, a) { return c.key });
}
tability.prototype.getColumnNum = function (colNum) {
    if (this.columnCount() <= colNum || colNum < 0) throw "invalid column index.";
    var ar = [this.columns[colNum].key];
    for (var m=this.rowCount(),i=0; i<m; i++) {
        ar.push(this.rows[i][colNum]);
    }
    return ar;
}
tability.prototype.getColumn = function (col){
    var index = this.columnIndex(col);
    return this.getColumnNum(index);
}
tability.prototype._resetColumns = function () {
    this.columns.splice(0,this.columns.length);
}

//rows
tability.prototype.addRow = function (r) {
    this.rows.push(r);
}
tability.prototype.insertRow = function (r, index) {
    this.rows.splice(index, 0, r);
}
tability.prototype.rowCount = function () {
    return this.rows.length;
}
tability.prototype.getRow = function (rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    return this.rows[i];
}
tability.prototype.getRowValue = function (col, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    var colIndex = this.columnIndex(col);
    if (colIndex != -1) return this.rows[rowNum][colIndex];
}
tability.prototype.setRowValue = function (col, value, rowNum) {
    if (this.rowCount <= rowNum || rowNum < 0) throw "invalid row index.";
    var colIndex = this.columnIndex(col);
    if (colIndex != -1) {
        this.rows[rowNum][colIndex] = value;
        return true;
    }
    throw "column "+col+" does not currently exist."
}
tability.prototype.insertNumRowValue = function(colNum, value, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    if (this.columnCount() <= colNum || colNum < 0) throw "invalid column index.";
    this.rows[rowNum].splice(colNum,0,value);
}
tability.prototype.getNumRowValue = function (colNum, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    if (this.columnCount() <= colNum || colNum < 0) throw "invalid column index.";
    return this.rows[rowNum][colNum];
}
tability.prototype.setNumRowValue = function (colNum, value, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    if (this.columnCount() <= colNum || colNum < 0) throw "invalid column index.";
    this.rows[rowNum][colNum] = value;
}
tability.prototype.redoRow = function (ar, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    this.rows[rowNum] = ar;
}
tability.prototype.resetRows = function () {
    this.rows.splice(0,this.rows.length);
}
tability.prototype.deleteRows = function (fro, to) {
    var rest = this.rows.slice(parseInt(to || fro) + 1 || this.rows.length);
    this.rows.length = fro < 0 ? this.rows.length + fro : fro;
    return this.rows.push.apply(this.rows, rest);
}

tability.prototype.clear = function(){
  this._resetColumns();
  this.resetRows();
}

// HTML
tability.prototype._setAttrs = function (attrs, elem) {
    if (!attrs) return;
    for (var key in attrs) {
        if (attrs[key]) {
            if (key === "style") {
                for (var skey in attrs[key]) {
                    elem[key][skey] = attrs[key][skey];
                }
            } else {
                elem[key] = attrs[key];
            }
        }
    }
}
tability.prototype.visibleRowCount = function(){
    return this.visibleRows.length;
}
tability.prototype._makeElem = function (domtype, inhtml, attrs) {
    var delem = document.createElement(domtype);
    if (inhtml) delem.innerHTML = inhtml;
    if (attrs) {
        this._setAttrs(attrs, delem);
    }
    return delem;
}
tability.prototype._tbody = function (inhtml, attrs) {
    return this._makeElem("tbody", inhtml, attrs);
}
tability.prototype._table = function (inhtml, attrs) {
    return this._makeElem("table", inhtml, attrs);
}
tability.prototype._col = function (inhtml, attrs) {
    return this._makeElem("col", inhtml, attrs);
}
tability.prototype._thead = function (inhtml, attrs) {
    return this._makeElem("thead", inhtml, attrs);
}
tability.prototype._th = function (inhtml, attrs) {
    return this._makeElem("th", inhtml, attrs);
}
tability.prototype._td = function (inhtml, attrs) {
    return this._makeElem("td", inhtml, attrs);
}
tability.prototype._tr = function (inhtml, attrs) {
    return this._makeElem("tr", inhtml, attrs);
}
tability.prototype.makeHead = function(){
  var thead = this._thead();
  var colOps = this.getAllColumnAttrs();
  var colCount = cols.length;
  for (var c = 0; c < colCount; c++) {
      var col = cols[c];
      var colOp = colOps[c];
      var htmcol = this._col(null, colOp);
      table.appendChild(htmcol);
      thead.appendChild(this._th(col));
  }
  return thead;
}
tability.prototype.makeBody = function(){
  var tbody = this._tbody();
  var rowCount = this.rowCount();
  for (var r = 0; r < rowCount; r++) {
      var dataRow = this.rows[r];
      var tr = this._tr();
      var dCount = dataRow.length;
      for (var d = 0; d < dCount; d++) {
          var datum = dataRow[d];
          var td = this._td(datum || "");
          tr.appendChild(td);
      }
      tbody.appendChild(tr);
  }
  return tbody;
}
tability.prototype.makeTable = function(){
  var table = this._table(null, this.getAttrs(this.tableAttrs));
  var colOps = this.getAllColumnAttrs();
  var cols = this.getColumnNames();
  var thead = this._thead();
  var colCount = cols.length;
  for (var c = 0; c < colCount; c++) {
      var col = cols[c];
      var colOp = colOps[c];
      var htmcol = this._col(null, colOp);
      table.appendChild(htmcol);
      thead.appendChild(this._th(col));
  }
  table.appendChild(thead);
  var tbody = this._tbody();
  var rowCount = this.visibleRowCount();
  for (var r = 0; r < rowCount; r++) {
      var dataRow = this.visibleRows[r];
      var tr = this._tr();
      var dCount = dataRow.length;
      for (var d = 0; d < dCount; d++) {
          var datum = dataRow[d];
          var td = this._td(datum || "");
          tr.appendChild(td);
      }
      tbody.appendChild(tr);
  }
  table.appendChild(tbody);
  return table;
}
tability.prototype.getTableHTML = function(){
  return this.makeTable().outerHTML;
}
tability.prototype.tabilify = function (domNode) {
    if (this.beforeBuild) this.beforeBuild();
    var table = this.makeTable();
    domNode.innerHTML = "";
    domNode.appendChild(table);
    if (this.afterBuild) this.afterBuild();
}
tability.prototype.retabilify = function(domNode){
  if (this.beforeBuild) this.beforeBuild();
  var tbody = domNode.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  for (var r = 0, m=this.visibleRowCount(); r < m; r++) {
    var dataRow = this.visibleRows[r];
    var tr = this._tr();
    var dCount = dataRow.length;
    for (var d = 0; d < dCount; d++) {
        var datum = dataRow[d];
        var td = this._td(datum || "");
        tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  if (this.afterBuild) this.afterBuild();
}
//Data Transformation
//Sorting
tability.prototype._custom = function(column,tfunc){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist."
    this._parent.rows.sort(tfunc);
}
tability.prototype._numericAscending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist."
    this._parent.rows.sort(function(a,b){
        return parseFloat(a[ind]) - parseFloat(b[ind]);
    });
}
tability.prototype._numericDescending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.rows.sort(function(a,b){
        return parseFloat(b[ind]) - parseFloat(a[ind]);
    });
}
tability.prototype._lexAscending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.rows.sort(function(a,b){
        return a.toString().localeCompare(b.toString());
    });
}
tability.prototype._lexDescending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.rows.sort(function(a,b){
        return b.toString().localeCompare(a.toString());
    });
}
tability.prototype._dateAscending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.rows.sort(function(a,b){
        return Date.parse(a) - Date.parse(b);
    });
}
tability.prototype._dateDescending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.rows.sort(function(a,b){
        return Date.parse(b) - Date.parse(a);
    });
}
// filtering
tability.prototype._filter = function(column, value, rFunc){
    var val = typeof value !== "array"? [value] : value;
    var ind = this.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    var func = rFunc || function(rw,dx){
        if (val.indexOf(rw[dx])>-1) return true;
        return false;
    };
    var ret = [];
    for (var i=0,u=this.rowCount(); i<u; i++){
        if (func(this.rows[i],ind)){
            ret.push(this.rows[i]);
        }
    }
    return ret;
}
tability.prototype.filter = function(column, value, rfunc){
    this.visibleRows = this._filter(column, value, rfunc);
}
tability.prototype.revertRows = function(){
    this.visibleRows = this.rows;
}
