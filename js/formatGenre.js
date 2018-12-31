function formatDropMenu(genres){
    let options = `<option class="options" value=""> -- select a genre -- </option>`;

    for  (let i=0; i<genres.length; i++) {
        options += `<option class="options" value="${genres[i]}">${genres[i]}</option>`;
    }
    $("#genreSelect").html(options);
}