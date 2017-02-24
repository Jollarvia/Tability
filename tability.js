var Tability = function (r, c, b, a) {
    "use strict";
    this._class = "ty-";
    this.tableAttrs = null;
    this.columns = [];
    this.datatypes = {"lexical": true, "numeric": true, "datetime": true};
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
    this.container = null;
    if (!c) {
        if (r&&r[0]){

            var header = r[0];
            r.splice(0,1);
            c = header;
	    }
    }
    this.rows = !r?[]:r;
    this.visibleRows = this.rows.slice(0, this.rows.length);
    this.visibleColumns = {};
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
    var _this = this;
    this.columns.forEach(function(vcol){
        _this.visibleColumns[vcol.key] = (vcol.visible === false)? false : true;
    })

}
Tability.prototype.standardAttrs = function (c, s) {
    var r = {};
    if (c) r["className"] = c;
    if (s) r["style"] = s;
    return r;
}
Tability.prototype.getAttrs = function (op) {
    var r = {};
    for (var o in op) {
        if (op.attrs && op.attrs[o]) r[o] = op.attrs[o];
    }
    return r;
}


//columns
Tability.prototype.containsColumn = function (col) {
    for (var o = 0,y=this.columns.length; o < y; o++) {
        if (this.columns[o].key === col) return true;
    }
    return false;
}
Tability.prototype.columnIndex = function (col) {
    var clength = this.columnCount();
    for (var o = 0; o < clength; o++) {
        if (this.columns[o].key === col) {
            return o;
        }
    }
    return -1;
}
Tability.prototype.addColumn = function (keyandattrs) {
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
    this.visibleColumns[k.key] = !(k.visible === false);
    return true;
}
Tability.prototype._insertColumn = function (keyandattrs, index) {
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
    this.columns.splice(index, 0, k);
    this.visibleColumns[k.key] = !(k.visible === false);
    return true;
}
Tability.prototype.insertColumn = function (keyandattrs,index) {
    if (this._insertColumn(keyandattrs,index)) {
        for (var i=0,m=this.rowCount();i<m;i++) {
            this.insertNumRowValue(index,null,i);
        }
        return true;
    }
    return false;
}
Tability.prototype.columnCount = function () {
    return this.columns.length;
}
Tability.prototype.makeColumnAttrs = function (span, border, background, width, visibility) {
    var r = {};
    if (span) r["span"] = span.toString();
    if (border) r["border"] = border;
    if (background) r["background"] = background;
    if (width) r["width"] = width;
    if (visibility) r["visibility"] = visibility;
    return r;
}
Tability.prototype.registerColumnFunc = function (column, func) {
    var i = this.columnIndex(column);
    if (i > -1) {
        this.registerColumnFuncNum(i, func);
    } else {
        throw "column does not exist."
    }
}
Tability.prototype.registerColumnFuncNum = function (colNum, func) {
    if (colNum > 0 && colNum < this.columnCount()) this.columns[colNum]["func"] = func;
    else throw "invalid column index."
}
Tability.prototype.getAllColumnAttrs = function () {
    return this.columns.map(function (c, i, a) { return (c.attrs) ? c.attrs : null });
}
Tability.prototype.getColumnAttrs = function (colNum) {
    return this.columns[colNum].attrs;
}
Tability.prototype.getColumnDatatype = function (colNum) {
    return this.columns[colNum].datatype;
}
Tability.prototype.getColumnOptions = function(colNum) {
    return this.columns[colNum];
}
Tability.prototype.getColumnNames = function () {
    return this.columns.map(function (c, i, a) { return c.key });
}
Tability.prototype.getColumnNum = function (colNum) {
    if (this.columnCount() <= colNum || colNum < 0) throw "invalid column index.";
    var ar = [this.columns[colNum].key];
    for (var m=this.rowCount(),i=0; i<m; i++) {
        ar.push(this.rows[i][colNum]);
    }
    return ar;
}
Tability.prototype.getColumn = function (col){
    var index = this.columnIndex(col);
    return this.getColumnNum(index);
}
Tability.prototype._resetColumns = function () {
    this.columns.splice(0,this.columns.length);
}

//rows
Tability.prototype.addRow = function (r) {
    this.rows.push(r);
}
Tability.prototype.insertRow = function (r, index) {
    this.rows.splice(index, 0, r);
}
Tability.prototype.rowCount = function () {
    return this.rows.length;
}
Tability.prototype.getRow = function (rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    return this.rows[i];
}
Tability.prototype.getRowValue = function (col, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    var colIndex = this.columnIndex(col);
    if (colIndex != -1) return this.rows[rowNum][colIndex];
}
Tability.prototype.setRowValue = function (col, value, rowNum) {
    if (this.rowCount <= rowNum || rowNum < 0) throw "invalid row index.";
    var colIndex = this.columnIndex(col);
    if (colIndex != -1) {
        this.rows[rowNum][colIndex] = value;
        return true;
    }
    throw "column "+col+" does not currently exist."
}
Tability.prototype.insertNumRowValue = function(colNum, value, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    if (this.columnCount() <= colNum || colNum < 0) throw "invalid column index.";
    this.rows[rowNum].splice(colNum,0,value);
}
Tability.prototype.getNumRowValue = function (colNum, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    if (this.columnCount() <= colNum || colNum < 0) throw "invalid column index.";
    return this.rows[rowNum][colNum];
}
Tability.prototype.setNumRowValue = function (colNum, value, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    if (this.columnCount() <= colNum || colNum < 0) throw "invalid column index.";
    this.rows[rowNum][colNum] = value;
}
Tability.prototype.redoRow = function (ar, rowNum) {
    if (this.rowCount() <= rowNum || rowNum < 0) throw "invalid row index.";
    this.rows[rowNum] = ar;
}
Tability.prototype.resetRows = function () {
    this.rows.splice(0,this.rows.length);
}
Tability.prototype.deleteRows = function (fro, to) {
    var rest = this.rows.slice(parseInt(to || fro) + 1 || this.rows.length);
    this.rows.length = fro < 0 ? this.rows.length + fro : fro;
    return this.rows.push.apply(this.rows, rest);
}

Tability.prototype.clear = function(){
  this._resetColumns();
  this.resetRows();
}

// HTML
Tability.prototype._setAttrs = function (attrs, elem) {
    if (!attrs) return;
    for (var key in attrs) {
        if (attrs[key]) {
            if (key === "style") {
                for (var skey in attrs[key]) {
                    elem[key][skey] = attrs[key][skey];
                }
            } else {
                elem.setAttribute(key, attrs[key]);
            }
        }
    }
}
Tability.prototype.visibleRowCount = function(){
    return this.visibleRows.length;
}
Tability.prototype.visibleColumnCount = function(){
    var b = 0;
    var _this = this;
    Object.keys(this.visibleColumns).forEach(function(el){
        if (_this.visibleColumns(el)) b++;
    })
    return b;
}
Tability.prototype._makeElem = function (domtype, inhtml, attrs) {
    var delem = document.createElement(domtype);
    if (inhtml) delem.innerHTML = inhtml;
    if (attrs) {
        this._setAttrs(attrs, delem);
    }
    return delem;
}
Tability.prototype._tbody = function (inhtml, attrs) {
    return this._makeElem("tbody", inhtml, attrs);
}
Tability.prototype._table = function (inhtml, attrs) {
    return this._makeElem("table", inhtml, attrs);
}
Tability.prototype._col = function (inhtml, attrs) {
    return this._makeElem("col", inhtml, attrs);
}
Tability.prototype._thead = function (inhtml, attrs) {
    return this._makeElem("thead", inhtml, attrs);
}
Tability.prototype._th = function (inhtml, attrs) {
    return this._makeElem("th", inhtml, attrs);
}
Tability.prototype._td = function (inhtml, attrs) {
    return this._makeElem("td", inhtml, attrs);
}
Tability.prototype._tr = function (inhtml, attrs) {
    return this._makeElem("tr", inhtml, attrs);
}
Tability.prototype.makeHead = function(table){
  var colOps = this.getAllColumnAttrs();
  var cols = this.getColumnNames();
  var thead = this._thead();
  var tr = this._tr();
  var colCount = cols.length;
  for (var c = 0; c < colCount; c++) {
      var col = cols[c];
      if (!this.visibleColumns[col]) continue;
      var colOp = colOps[c];
      var htmcol = this._col(null, colOp);
      table && table.appendChild(htmcol);
      var th = this._th(col);
      th.className = this._class + "hc-" + c + " " + this._class + "hc";
      tr.appendChild(th);
  }
  thead.appendChild(tr);
  table && table.appendChild(thead);
  return thead;
}
Tability.prototype.makeBody = function(table){
  var tbody = this._tbody();
  var rowCount = this.visibleRowCount();
  var cols = this.getColumnNames();
  for (var r = 0; r < rowCount; r++) {
      var dataRow = this.visibleRows[r];
      var tr = this._tr();
      var dCount = dataRow.length;
      for (var d = 0; d < dCount; d++) {
          if (!this.visibleColumns[cols[d]]) continue;
          var datum = this.columns[d]["func"]? this.columns[d]["func"](dataRow[d]):dataRow[d];
          var td = this._td(datum || "");
          td.className = this._class + 'r-' + r + ' ' + this._class + 'c-' + d;
          tr.appendChild(td);
      }
      tbody.appendChild(tr);
  }
  table && table.appendChild(tbody);
  return tbody;
}
Tability.prototype.makeTable = function(){
  var table = this._table(null, this.getAttrs(this.tableAttrs));
  this.makeHead(table);
  this.makeBody(table);
  return table;
}
Tability.prototype.getTableHTML = function(){
  return this.makeTable().outerHTML;
}
Tability.prototype.tabilify = function (domNode) {
    if (typeof domNode == "string") domNode = document.getElementById(domNode);
    if (!domNode) throw "No dom node found.";
    this.container = domNode; 
    if (this.beforeBuild) this.beforeBuild();
    var table = this.makeTable();
    domNode.innerHTML = "";
    domNode.appendChild(table);
    if (this.afterBuild) this.afterBuild();
}
Tability.prototype.retabilify = function(){
  if (!this.container) throw "No dom node found.";
  var domNode = this.container;
  if (this.beforeBuild) this.beforeBuild();
  var tbody = domNode.getElementsByTagName("tbody")[0];
  newTbody = this.makeBody();
  domNode.getElementsByTagName("table")[0].removeChild(tbody);
  domNode.getElementsByTagName("table")[0].appendChild(newTbody);
  
  if (this.afterBuild) this.afterBuild();
}
//Data Transformation
//Sorting
Tability.prototype._custom = function(column,tfunc){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist."

    this._parent.visibleRows.sort(function(a,b){
        return tfunc(a[i], b[i]);
    });
}
Tability.prototype._numericAscending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist."
    this._parent.visibleRows.sort(function(a,b){
        return parseFloat(a[ind]) - parseFloat(b[ind]);
    });
}
Tability.prototype._numericDescending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.visibleRows.sort(function(a,b){
        return parseFloat(b[ind]) - parseFloat(a[ind]);
    });
}
Tability.prototype._lexAscending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.visibleRows.sort(function(a,b){
        return a[ind].toString().localeCompare(b[ind].toString());
    });
}
Tability.prototype._lexDescending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.visibleRows.sort(function(a,b){
        return b[ind].toString().localeCompare(a[ind].toString());
    });
}
Tability.prototype._dateAscending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.visibleRows.sort(function(a,b){
        return Date.parse(a[ind]) - Date.parse(b[ind]);
    });
}
Tability.prototype._dateDescending = function(column){
    var ind = this._parent.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    this._parent.visibleRows.sort(function(a,b){
        return Date.parse(b[ind]) - Date.parse(a[ind]);
    });
}
// filtering
Tability.prototype._filter = function(column, value, rFunc){
    var ind = this.columnIndex(column);
    if (ind == -1) throw "Column does not exist.";
    var func = rFunc || function(rw,dx){
        if (rw[dx].toLowerCase().indexOf(value.toLowerCase())>-1) return true;
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
Tability.prototype.filter = function(column, value, rfunc){
    this.visibleRows = this._filter(column, value, rfunc);
}
Tability.prototype.revertRows = function(){
    this.visibleRows = this.rows.slice(0,this.rows.length);
}
Tability.prototype.setColumnVisibility = function(column, visibility){
    this.visibleColumns[column] = visibility;
}
Tability.prototype.getColumnVisibility = function(column){
    return this.visibleColumns[column];
}
Tability.prototype.autoSort = function(header, toggle){
    var datatype = this.getColumnDatatype(this.columnIndex(header));
    if (datatype) this.sort[datatype][toggle? "ascending" : "descending"](header);
    else this.sort.lexical[toggle? "ascending" : "descending"](header);

}
