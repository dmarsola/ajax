$(()=>{
    function $$(id){ return document.getElementById(id); }

    $('#searchAlbum').on('click', (el)=>{
        $(location).attr('href', './index.html');
    });

    $.get("./php/files/genres.txt", (result)=>{
        // console.log(result);
        let genres = result.split("\r\n");
        formatDropMenu(genres);
    });

    let albumNameMessage = $('#albumNameMessage');
    let artistMessage = $('#artistMessage');
    let conditionMessage = $('#conditionSelectMessage');
    let companyMessage = $('#companyMessage');
    let genreMessage = $('#genreSelectMessage');
    let yearMessage = $('#yearMessage');
    let priceMessage = $('#priceMessage');

    function hideAllWarnings(){
        albumNameMessage.text('');
        albumNameMessage.hide();
        artistMessage.text('');
        artistMessage.hide();
        companyMessage.text('');
        companyMessage.hide();
        conditionMessage.text('');
        conditionMessage.hide();
        genreMessage.text('');
        genreMessage.hide();
        yearMessage.text('');
        yearMessage.hide();
        priceMessage.text('');
        priceMessage.hide();
    }

    $("#addAlbumForm").submit(function(e){
        e.preventDefault();
        hideAllWarnings();
        let validated = true;
        let albumName = ($$('albumName').value).trim();
        let artist = ($$('artist').value).trim();
        let company = ($$('company').value).trim();
        let selectedCondition = $$('conditionSelect').selectedIndex;
        let condition = $$('conditionSelect').options[selectedCondition].value;
        let selectedGenre = $$('genreSelect').selectedIndex;
        let genre = $$('genreSelect').options[selectedGenre].value;
        let year = ($$('year').value).trim();
        let price = $$('price').value.trim();


        if (albumName == ""){
            validated = false;
            albumNameMessage.text('Sorry, album name cannot be empty.');
            albumNameMessage.show();
        }
        if (artist == ""){
            validated = false;
            artistMessage.text('Sorry, artist name cannot be empty.');
            artistMessage.show();
        }
        if (company == ""){
            validated = false;
            companyMessage.text('Sorry, company name cannot be empty.');
            companyMessage.show();
        }
        if (year == ""){
            validated = false;
            yearMessage.text('Sorry, release year cannot be empty.');
            yearMessage.show();
        }
        if (price == ""){
            validated = false;
            priceMessage.text('Sorry, the album has to have a price.');
            priceMessage.show();
        }
        if (condition == ""){
            validated = false;
            conditionMessage.text('Sorry, select a conservation condition option.');
            conditionMessage.show();
        }
        if (genre == ""){
            validated = false;
            genreMessage.text('Sorry, select a music genre.');
            genreMessage.show();
        }
        if (isNaN(price)){
            validated = false;
            priceMessage.text('Sorry, price has to be a currency number.');
            priceMessage.show();
        }

        if (isNaN(year)){
            validated = false;
            yearMessage.text('Sorry, year has to be a 4 digit number.');
            yearMessage.show();
        }

        if (!isNaN(year) && year < 1000){
            validated = false;
            yearMessage.text('Sorry, use a 4-digit year.');
            yearMessage.show();
        }

        let date = new Date();
        if (!isNaN(year) && year > date.getFullYear()) {
            validated = false;
            yearMessage.text(`Sorry, I cannot accept a future year like ${year}.`);
            yearMessage.show();
        }

        console.log(validated);

        if (validated){
            let priceSubmit = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2
            }).format(price);

            $.post( "./php/addAlbum.php", {
                'genre': genre,
                'albumName': albumName,
                'artist': artist,
                'company': company,
                'condition': condition,
                'year': year,
                'price': priceSubmit
            }).done( (resp)=>{
                $$('addAlbumForm').reset();
                $('#successMessage').show();
                setTimeout(()=>{$('#successMessage').hide("slow")}, 3000)
            }).fail( (err)=>{
                console.log(err.message);
                alert('Sorry, could not process your request at this time. Try again later or contact the administrator.');
            });
        }
    }); // Form submit function
});
