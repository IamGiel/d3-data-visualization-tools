export const dropdown = (selection, props) => {
    const  { 
        options,
        onOptionsClicked
     } = props;

    // console.log("options from dropdown.ts ",options)

    let select = selection
                .selectAll('select')
                .data([null]);
    select = select
                .enter()
                .append('select')
                .merge(select)
                .on('change', function(){
                    onOptionsClicked(this.value)
                });

    const option = select
                .selectAll('option')
                .data(options);
    option
        .enter()
        .append('option')
        .merge(option)
        .attr('value', d => d)
        .text(d=>d)
}