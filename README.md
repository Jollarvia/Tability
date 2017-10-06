# Tability
Lightweight, fast dataset for displaying and manipulating html tables. It quickly writes HTML tables that conform to modern standards, completely free of dependencies but are usable in packages like jQuery UI and Bootstrap.

    var table = new Tability();

Or begin with data inside:

    var table = new Tability(
	rowsArray, columnsArray
    );


Columns can be strings for the names of headers. For more power: 

    columnsArray = [
    {key:"Header Name",
     className:"table-header",
    style:{color: "blue"},
    func:transformFunction}, ...etc]
*func is a function that transforms row data points before display.

Add rows or columns dynamically:
 - insertRow
 - addRow
 - redoRow
 - insertColumn
 - addColumn

   


----------


     table.insertRow(["cheese","pepperoni","sausage"],3)

*inserts row at index 3.

    table.addColumn("Cheese Type");
*adds "Cheese Type" as final column in table.

## Sorting  & Filtering ##
Tability can sort rows based on a single column. What if you want to sort Cheese Types in descending order?
 - lexical
 - numeric
 - datetime

 


----------


    table.sort.lexical.descending("Cheese Type");

 

Tability can filter too:

    table.filter("Cheese Type","Mozzarella");
*will display only rows with Mozzarella as the Cheese Type. Optionally takes a function as the third argument so you can choose how to filter yourself.
## Displaying HTML ##
Your table is ready for primetime. Grab a container element and tabilify on it:

    var container = document.getElementById("my-table-container");
    table.tabilify(container);
Now your Mozzarella preferences are revealed to the world.

