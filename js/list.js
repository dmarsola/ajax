$(()=>{

    function buildGrid(album, artist, company, conservation, year, price){
        // console.log(artist[0]);
        let artistList='';
        if (artist.length > 1){
            Array.from(artist).map(el =>{
                artistList += `<i class="fas fa-users"></i> ${el.firstChild.nodeValue}<br />`;
            });
        } else
            artistList = `<i class="fas fa-user"></i> ${artist[0].firstChild.nodeValue}<br />`;

        switch(conservation){
            case "VP": conservation = "Very Poor"; break;
            case "P": conservation = "Poor"; break;
            case "G": conservation = "Good"; break;
            case "VG": conservation = "Very Good"; break;
            case "M": conservation = "Mint"; break;
            default: break;
        }

        return `<div>
            <p><i class="fas fa-compact-disc"></i><spam class="title"> ${album}</spam><br />
            ${artistList}
            <i class="fas fa-building"></i> ${company}<br />
            <i class="fas fa-certificate"></i> ${conservation}<br />
            <i class="far fa-calendar-alt"></i> ${year}<br />
            <i class="fas fa-dollar-sign"></i> ${price}</p>
        </div>`;
    }

    $.get("./php/files/genres.txt", (result)=>{
        // console.log(result);
        let genres = result.split("\r\n");
        formatDropMenu(genres);
    });

    $('#addAlbum').on('click', (el)=>{
        $(location).attr('href', './addAlbums.html');
    });

    $("#genreSelect").on('change', (el)=>{
        var genreUpdate = function update(){
            if (el.target.value != ""){
                console.log("Updating album list...");
                $('#grid').html('');
                $("#placeholder").hide();
                $.ajax({
                    url: `./php/getAlbums.php?genre=${el.target.value}`,
                    type: 'post',
                    dataType: 'xml',
                    success: function(result){
                        let albumInfo = result.getElementsByTagName('album');
                        // console.log(result);
                        // console.log(albumInfo);
                        // console.log(albumInfo.length);
                        let tempGrid = '';
                        for (let i=0; i<albumInfo.length; i++){
                            tempGrid += buildGrid(
                                albumInfo[i].querySelector('albumName').firstChild.nodeValue,
                                albumInfo[i].querySelectorAll('artist'),
                                albumInfo[i].querySelector('company').firstChild.nodeValue,
                                albumInfo[i].querySelector('condition').firstChild.nodeValue,
                                albumInfo[i].querySelector('year').firstChild.nodeValue,
                                albumInfo[i].querySelector('price').firstChild.nodeValue
                            );
                        }
                        $('#grid').html(tempGrid);
                    },
                    error: function(err){
                        alert(`Error. Contact administrator. Message: ${err.statusText}`)
                    }
                });
            setTimeout(genreUpdate, 10000);
            } else {
                clearTimeout(genreUpdate);
                $("#placeholder").show();
                $('#grid').html('');
            }
        };
        genreUpdate();
    });

});
