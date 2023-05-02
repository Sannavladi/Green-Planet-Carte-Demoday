var map = L.map('map').setView([48.86666667, 2.3333333], 11.5);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var themes = {
    'alimentation': {
        'iconUrl': 'img/marker-icon-2x-gold.png',
        'shadowUrl': 'img/marker-shadow.png',
        'iconSize': [25, 41],
        'iconAnchor': [10, 33],
        'popupAnchor': [1, -28],
        'shadowSize': [33, 33],
        'className': 'marker-theme1'
    },
    'vêtements': {
        'iconUrl': 'img/marker-icon-2x-violet.png',
        'shadowUrl': 'img/marker-shadow.png',
        'iconSize': [25, 41],
        'iconAnchor': [10, 33],
        'popupAnchor': [1, -28],
        'shadowSize': [33, 33],
        'className': 'marker-theme2'
    },
    'réparation': {
        'iconUrl': 'img/marker-icon-2x-red.png',
        'shadowUrl': 'img/marker-shadow.png',
        'iconSize': [25, 41],
        'iconAnchor': [10, 33],
        'popupAnchor': [1, -28],
        'shadowSize': [33, 33],
        'className': 'marker-theme3'
    },
    'ameublement': {
        'iconUrl': 'img/marker-icon-2x-green.png',
        'shadowUrl': 'img/marker-shadow.png',
        'iconSize': [25, 41],
        'iconAnchor': [10, 33],
        'popupAnchor': [1, -28],
        'shadowSize': [33, 33],
        'className': 'marker-theme4'
    }
  };


var modal = document.querySelector('#laModale');
var inputTitre = document.querySelector('#titre');
var inputInfo = document.querySelector('#inputField');
var inputTheme = document.querySelector('#dropdown');
var coordonnée

function onMapClick(e) {
    modal.showModal();
    console.log(e.latlng);
    var marker = new L.Marker([e.latlng.lat, e.latlng.lng]).addTo(map);
    coordonnée = e.latlng
    var popupContent = "<strong>" + e.latlng.lat + "</strong><p>" + e.latlng.lng + "</p>";
    var popupOptions = {
        autoPan: true,
        autoPanPadding: L.point(50, 50)
    };
    var popup = L.popup(popupOptions).setContent(popupContent);
    marker.bindPopup(popup).openPopup();
}

map.on('click', onMapClick);
modal.addEventListener('close', function () {
    console.log(modal.returnValue);
    console.log(inputTitre.value);
    console.log(inputTheme.value);
    console.log(coordonnée);
    if (modal.returnValue == 'oui') {
        ajoutMarker(inputTitre.value, inputInfo.value, inputTheme.value, coordonnée)
        location.reload();
    } else {location.reload();}
});


// pour ajouter un nouveau marqueur avec des informations personnalisées (le titre, les informations, le thème, les coordonnées et l'image)
  function ajoutMarker(x, y, z, coordonnée) {
      var imageFile = document.querySelector('#image').files[0];
      var reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = function() {
          tableauMarker.push({
              titre : x,
              info : y,
              theme : z,
              coordonée : [coordonnée.lat, coordonnée.lng],
              image : reader.result
          });
          console.log(tableauMarker);
          localStorage.setItem('savetableauMarker', JSON.stringify(tableauMarker));
      };
  }


var tableauMarker = JSON.parse(localStorage.getItem('savetableauMarker')) || [];
var savedMarkers = localStorage.getItem('savetableauMarker');

if (savedMarkers) {
    savedMarkers = JSON.parse(savedMarkers);
    // Ajoute chaque marker à la carte
    savedMarkers.forEach(function(marker) {
        var theme = marker.theme
        var newMarker = new L.marker(marker.coordonée, {icon:L.icon(themes[theme])}).addTo(map);
        // newMarker.bindPopup("<strong>" + marker.titre + "</strong><br><img src='" + marker.image + "'><br>" + marker.theme);
        newMarker.bindPopup("<strong>" + marker.titre + "</strong><br>" + marker.info + "</strong><br>" + marker.theme);

    });
}


  //Ce code utilise une boucle forEach pour parcourir un tableau de marqueurs appelé "savedMarkers". Pour chaque élément du tableau, il récupère le thème du marqueur, puis crée un nouveau marqueur avec une icône correspondant au thème, en utilisant la bibliothèque Leaflet.
  savedMarkers.forEach(function(marker) {
      var theme = marker.theme;
      var newMarker = new L.marker(marker.coordonée, { icon: L.icon(themes[theme]) }).addTo(map);
      //une variable "content" qui contient les informations à afficher dans la fenêtre contextuelle du marqueur(le titre du marqueur, l'information, le thème et éventuellement une image). Si une image est fournie, elle est affichée avec une hauteur de 100 pixels.
      var content = "<strong>" + marker.titre + "</strong><br>" + marker.info + "</strong><br>" + marker.theme;
      if (marker.image) {
          content += "<br><img src='" + marker.image + "' height='100'>";
      }
      //le code ajoute un bouton "Supprimer" qui, lorsqu'il est cliqué, appelle une fonction "supprimerMarker" avec les coordonnées du marqueur à supprimer.
      content += "<br><button width='120px' onclick='supprimerMarker(" + JSON.stringify(marker.coordonée) + ")'>Supprimer</button>";
      newMarker.bindPopup(content);
  });



//Des marqueurs s'affichent par défaut
let markersBase = [
    {titre:"RepairCafeParis – atelier de réparation collaboratif",
    description:"Ateliers de réparation collaboratifs où des bénévoles partagent connaissances et savoir-faire avec des personnes apportant leurs objets en panne. <br>Adresse : 6 rue Drouot, 75009 - <a href='https://www.repaircafeparis.fr/' target='_blank'>https://www.repaircafeparis.fr/</a>",
    coords:{lat:48.8725984,lng:2.3404534},
    image: "img/repaircafeparis.jpg",
    theme:"réparation"},
    {titre:"Le Poulpe",
    description:"Le Poulpe récupère vos objets même cassés, abîmés ou vieillots, pour les réparer et leur donner une deuxième vie.<br>Adresse: 4 bis rue d’Oran, 75018 Paris - <a href='https://lepoulperessourcerie.org/' target='_blank'>https://lepoulperessourcerie.org/</a>",
    coords: { lat: 48.8890471, lng: 2.3540006 },
    image: "img/ressourceriepoulpe.jpg",
    theme:"ameublement"},
    {titre:"La Recyclerie",
    description:"Projet innovant qui combine plusieurs activités différentes. La recyclerie c’est un café-cantine mais aussi une ferme urbaine et un atelier de réparations collaboratif, un centre de ressource et d’apprentissage. <br>Adresse : 83, boulevard Ornano, 75018 Paris - <a href='https://www.larecyclerie.com/' target='_blank'>https://www.larecyclerie.com/</a>",
    coords: { lat: 48.897633, lng: 2.3425959 },
    image: "img/larecyclerie.jpg",
    theme:"réparation"},
    // {titre:"Projet Boussole",
    // description:"Vente de vélo classique et /ou électrique reconditionné. <br>Adresse : 112 rue martre, Clichy (Métro L 13, Mairie de Clichy) - <a href='https://projetboussole.fr/' target='_blank'>https://projetboussole.fr/</a>",
    // coords: { lat: 48.905533, lng: 2.3040378 },
    // image: "/img/projetboussole.png", 
    // theme:"réparation"},
    {titre:"Envie le Labo",
    description:"Cette association propose des ateliers de réparations d'électroménager, mais récupère également les anciens appareils et vend du matériel reconditionné. <br>Adresse : 10 rue Julien Lacroix, 75020 Paris - <a href='https://www.envie.org/envielelabo/' target='_blank'>https://www.envie.org/envielelabo/</a>",
    coords: { lat: 48.8889998, lng: 2.3539018 },
    image: "img/envie.jpg",
    theme:"réparation"},
    {titre:"La Textilerie",
    description:"La Textilerie est une recyclerie spécialisée… dans le textile. Elle collecte, trie, valorise toutes les pièces liées à l’univers du textile et de l’habillement issues de dons. <br>Adresse: 22 rue du Château Landon 75010 Paris - <a href='https://www.latextilerie.fr/' target='_blank'>https://www.latextilerie.fr/</a>",
    coords: { lat: 48.8813491, lng: 2.3629162 },
    image: "img/latextilerie.jpg",
    theme:"vêtements"},
    {titre:"Les puces de Saint Ouen",
    description:"Les Marchés sont ouverts tous les week-ends de l’année, du vendredi au lundi. <br>Adresse: 110 Rue des Rosiers, 93400 Saint-Ouen-sur-Seine - <a href='https://www.pucesdeparissaintouen.com/' target='_blank'>https://www.pucesdeparissaintouen.com/</a>",
    coords: { lat: 48.9040935, lng: 2.3391137 },
    image: "img/lespuces.jpg",
    theme:"vêtements"},
    {titre:"Les puces de Saint Ouen",
    description:"Les Marchés sont ouverts tous les week-ends de l’année, du vendredi au lundi. <br>Adresse: 110 Rue des Rosiers, 93400 Saint-Ouen-sur-Seine - <a href='https://www.pucesdeparissaintouen.com/' target='_blank'>https://www.pucesdeparissaintouen.com/</a>",
    coords: { lat: 48.9040933, lng: 2.3391135 },
    image: "img/lespuces2.jpg",
    theme:"ameublement"},
    {titre:"Le Vestiaire du 18ème",
    description:"Le Vestiaire du 18ème propose une large sélection de vêtements, chaussures, sacs, bijoux et accessoires pour femmes. <br>Adresse :  18 rue Damrémont, 75018 Paris - <a href='https://levestiairedu18eme.com/' target='_blank'>https://levestiairedu18eme.com/</a>",
    coords: { lat: 48.8883021, lng: 2.3330516 },
    image: "img/levestiairedu18eme.jpg",
    theme:"vêtements"},
    {titre:"Bobby Second Hand",
    description:"Dépôt-vente de vêtements vintage, seconde main. <br>Adresse : 89 rue Reaumur, 75002 Paris -  <a href='https://www.bobbyparis.com/' target='_blank'>https://www.bobbyparis.com/</a>",
    coords: { lat: 48.8673288, lng: 2.3469497 },
    image: "img/bobbyparis.jpg",
    theme:"vêtements"},
    {titre:"Emmaüs Alternatives Davout",
    description:"Magasin d'occasion au cadre fonctionnel où trouver des jouets pour enfants et des vêtements pour toute la famille. <br>Adresse : 105 Bd Davout, 75020 Paris - <a href='https://www.emmaus-alternatives.org/boutiques/boutique-davout/' target='_blank'>https://www.emmaus-alternatives.org/boutiques/boutique-davout/</a>",
    coords: { lat: 48.8560039, lng: 2.4099105 },
    image: "img/emmaus.jpg",
    theme:"vêtements"},
    {titre:"La boutique sans argent",
    description:"Venez récupérer gratuitement des objets pour leur donner une seconde vie. <br>Adresse :  2 rue Edouard Robert, 75012 Paris - <a href='https://laboutiquesansargent.org/' target='_blank'>https://laboutiquesansargent.org/</a>",
    coords: { lat: 48.8363155, lng: 2.4003408 },
    image: "img/boutiquesansargent.jpg",
    theme:"ameublement"},
    {titre:"Emmaüs Solidarité Boutique- Paris 9",
    description:"Boutique Solidaire d’achat de meubles et nécessaires d’intérieurs de seconde main. <br>Adresse : 27-29 Blvd Marguerite de Rochechouart, 75009 Paris - <a href='https://www.emmaus-paris.fr/' target='_blank'>https://www.emmaus-paris.fr/</a>",
    coords: { lat: 48.882979, lng: 2.3458252 },
    image: "img/emmaus2.jpg",
    theme:"ameublement"},
    {titre:"La Louve",
    description:"Cette coopérative propose une alimentation de qualité, à prix réduit, en majorité bio, locale ou artisanale. <br>Adresse : 116, rue des Poissonniers, 75018 Paris - <a href='https://cooplalouve.fr/' target='_blank'>https://cooplalouve.fr/</a>",
    coords: { lat: 48.8943537, lng: 2.3529706 },
    image: "img/lalouve.jpg",
    theme:"alimentation"},
    {titre:"Charlie's Market",
    description:"Chaîne de magasins qui vend des produits alimentaires à prix cassés dans une démarche anti-gaspi. <br>Adresse: 19 rue de Ménilmontant - <a href='https://www.charliesmarket.fr/' target='_blank'>https://www.charliesmarket.fr/</a>",
    coords: { lat: 48.8674778, lng: 2.3845304 },
    image: "img/charliesmarket.jpg",  
    theme:"alimentation"},
    {titre:"Nous Anti-Gaspi",
    description:"Consommez différemment en donnant un sens à votre acte d’achat. Les produits sont moins chers que dans les circuits traditionnels. <br>Adresse: 38 rue de Reuilly, 75012 Paris - <a href='https://www.nousantigaspi.com/' target='_blank'>https://www.nousantigaspi.com/</a>",
    coords: { lat: 48.8456685, lng: 2.3883237 },
    image: "img/nousantigaspi.jpg", 
    theme:"alimentation"},
    {titre:"NOUS épicerie anti-gaspi",
    description:"Ensemble, agissons pour une alimentation responsable ! Chaque semaine des produits à sauver du gaspillage à prix canoooons ! <br>Adresse : 11 Rue de l'Ouest, 75014 Paris - <a href='https://www.nousantigaspi.com/' target='_blank'>https://www.nousantigaspi.com/</a>",
    coords: { lat: 48.8372643, lng: 2.3221956 },
    image: "img/nousepicerie.jpg", 
    theme:"alimentation"},
    {titre:"La Salle des Ventes du Particulier",
    description:"De meubles de toutes les époques sont vendus dans ce dépôt-vente qui propose aussi des bibelots anciens. <br>Adresse : 116 Rue d'Alésia, 75014 Paris - <a href='https://www.lasalledesventes.fr/' target='_blank'>https://www.lasalledesventes.fr/</a>",
    coords: { lat: 48.8296218, lng: 2.3220439 },
    image: "img/salledesventes.jpg", 
    theme:"ameublement"},
    {titre:"Ding Fring",
    description:"Friperie solidaire proposant vêtements et accessoires tendance ou vintage à prix réduits pour tous les âges. <br>Adresse : 39 Rue Labrouste, 75015 Paris - <a href='https://www.label-emmaus.co/fr/nos-boutiques/ding-fring-le-relais-val-de-seine-emmaus-1/' target='_blank'>https://www.label-emmaus.co/fr/nos-boutiques/ding-fring-le-relais-val-de-seine-emmaus-1/</a>",
    coords: { lat: 48.83361, lng: 2.30799 },
    image: "img/dingfring.jpg", 
    theme:"vêtements"},
    {titre:"BIS Boutique Solidaire ",
    description:"BIS, c’est la seconde vie d’une sélection haut de gamme et pointue de prêt à porter ! <br>Adresse : 96 Rue St Charles, 75015 Paris - <a href='https://www.bisboutiquesolidaire.fr/' target='_blank'>https://www.bisboutiquesolidaire.fr/</a>",
    coords: { lat: 48.8458193, lng: 2.2846695 },
    image: "img/bisboutiquesolidaire.jpg", 
    theme:"vêtements"},
    {titre:"La Trockette Café-Atelier",
    description:"La Petite Rockette, c'est deux ressourceries, un café atelier, un restaurant anti gaspi, un espace culturel, un atelier vélo coopératif, un pôle d'animation/sensibilisation locale, un chantier d'insertion, une boutique de vêtements vintage de seconde main...<br>Adresse : 125 rue du Chemin Vert 75011 Paris - <a href='http://www.lapetiterockette.org/cafeatelier' target='_blank'>http://www.lapetiterockette.org/cafeatelier</a>",
    coords: { lat: 48.8435588, lng: 2.3892418 },
    image: "img/trockette.jpg", 
    theme:"réparation"},
    // {titre:"La Trockette Café-Atelier",
    // description:"La Petite Rockette, c'est deux ressourceries, un café atelier, un restaurant anti gaspi, un espace culturel, un atelier vélo coopératif, un pôle d'animation/sensibilisation locale, un chantier d'insertion, une boutique de vêtements vintage de seconde main...",
    // coords: { lat: 48.862099, lng: 2.3839422 },
    // image: "#", 
    // theme:"alimentation"},
    // {titre:"La Trockette Café-Atelier",
    // description:"La Petite Rockette, c'est deux ressourceries, un café atelier, un restaurant anti gaspi, un espace culturel, un atelier vélo coopératif, un pôle d'animation/sensibilisation locale, un chantier d'insertion, une boutique de vêtements vintage de seconde main...",
    // coords: { lat: 48.862099, lng: 2.3839422 },
    // image: "#", 
    // theme:"ameublement"},
    // {titre:"La Cadette - La Trockette Café-Atelier",
    // description:"La Petite Rockette, c'est deux ressourceries, un café atelier, un restaurant anti gaspi, un espace culturel, un atelier vélo coopératif, un pôle d'animation/sensibilisation locale, un chantier d'insertion, une boutique de vêtements vintage de seconde main...",
    // coords: { lat: 48.8428132, lng: 2.3897644 },
    // image: "#",
    // theme:"vêtements"}
]

const themesBase = { //pour q
        'alimentation': {
            'iconUrl': 'img/marker-icon-2x-gold.png',
            'iconSize': [25, 41]
        },
        'vêtements': {
            'iconUrl': 'img/marker-icon-2x-violet.png',
            'iconSize': [25, 41]
        },
        'réparation': {
            'iconUrl': 'img/marker-icon-2x-red.png',
            'iconSize': [25, 41]
        },
        'ameublement': {
            'iconUrl': 'img/marker-icon-2x-green.png',
            'iconSize': [25, 41]
        },
      };

var allMarkers = [];

function setMarkersBase() { 
      markersBase.forEach(function(marker) {
        const theme = marker.theme;
        // const icon = icons[themeBase];
          L.marker(marker.coords, {icon: L.icon(themesBase[theme])}).addTo(map)
          .bindPopup("<strong>" + marker.titre + "</strong><br>" + marker.description + "</strong><br>" + marker.theme + "<br><img src='" + marker.image + "' width='120'>");
          allMarkers.push(marker);
      });
  }

setMarkersBase();


// Au clic sur le bouton, affiche les marqueurs de la catégorie sélectionnée
document.getElementById("show-almt").addEventListener("click", function() {
    showMarkers('alimentation');
    // filterMarkersBase('alimentation');
    themesBase.alimentation.iconUrl = "img/marker-icon-2x-gold.png";
    themesBase.ameublement.iconUrl = "img/nop.png";
    themesBase.réparation.iconUrl = "img/nop.png";
    themesBase.vêtements.iconUrl = "img/nop.png";
    setMarkersBase();
});

document.getElementById("show-vtm").addEventListener("click", function() {
    showMarkers('vêtements');
    // filterMarkersBase('vêtements');
    themesBase.vêtements.iconUrl = "img/marker-icon-2x-violet.png";
    themesBase.ameublement.iconUrl = "img/nop.png";
    themesBase.réparation.iconUrl = "img/nop.png";
    themesBase.alimentation.iconUrl = "img/nop.png";
    setMarkersBase();
});

document.getElementById("show-rpr").addEventListener("click", function() {
    showMarkers('réparation');
    // filterMarkersBase('réparation');
    themesBase.réparation.iconUrl = "img/marker-icon-2x-red.png";
    themesBase.ameublement.iconUrl = "img/nop.png";
    themesBase.alimentation.iconUrl = "img/nop.png";
    themesBase.vêtements.iconUrl = "img/nop.png";
    setMarkersBase();
});

document.getElementById("show-ambl").addEventListener("click", function() {
    showMarkers('ameublement');    
    // filterMarkersBase('ameublement');
    themesBase.ameublement.iconUrl = "img/marker-icon-2x-green.png";
    themesBase.alimentation.iconUrl = "img/nop.png";
    themesBase.réparation.iconUrl = "img/nop.png";
    themesBase.vêtements.iconUrl = "img/nop.png";
    setMarkersBase();
});

document.getElementById("show-all").addEventListener("click", function() {
    location.reload();
});

// Fonction d'affichage des marqueurs d'une certaine catégorie
function showMarkers(category) {
    // Supprime tous les marqueurs de la carte
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });
   // Ajouter uniquement les marqueurs de la catégorie sélectionnée à la carte
    
    
    
    savedMarkers.forEach(function (marker) {
        if (marker.theme === category) {
            var newMarker = new L.marker(marker.coordonée, {icon:L.icon(themes[category])}).addTo(map);
            var content = "<strong>" + marker.titre + "</strong><br>" + marker.info + "</strong><br>" + marker.theme;
         content += "<br><button class='supprimer' onclick='supprimerMarker(" + JSON.stringify(marker.coordonée) + ")'>Supprimer</button>";
         newMarker.bindPopup(content);
            
            // newMarker.bindPopup("<strong>" + marker.titre + "</strong><br>" + marker.info + "</strong><br>" + category);
        }
    });

}


function supprimerMarker(coordonée) {
    // Retirer le marqueur de la carte
    map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
            var layerCoords = [layer.getLatLng().lat, layer.getLatLng().lng];
            if (JSON.stringify(layerCoords) == JSON.stringify(coordonée)) {
                map.removeLayer(layer);
                layer.remove();
            }
        }
    });

    // Retirer le marqueur du tableau
    tableauMarker = tableauMarker.filter(function(marker) {
        return JSON.stringify(marker.coordonée) != JSON.stringify(coordonée);
    });

    // Enregistrer le tableau dans le localstorage
    localStorage.setItem('savetableauMarker', JSON.stringify(tableauMarker));
}



