const fetch = require('node-fetch');
const cheerio = require('cheerio');

const base_url = 'https://www.studentenwerk-muenchen.de';
const mainpage_url = 'https://www.studentenwerk-muenchen.de/en/student-accommodation/housing-referral-service/offers';

String.prototype.remove_linebreaks = function remove_linebreaks()
{
	return this.replace(/\r?\n|\r/g, '');
} 

async function parseOffer(details, $$)
{
    city_area = $$(details[0]).text().trim();
    street = $$(details[1]).text().trim();
    type_of_room = $$(details[2]).text().trim();
    furnishing = $$(details[3]).text().trim();
    size = $$(details[4]).text().trim();
    number_of_rooms = $$(details[5]).text().trim();
    base_rent = $$(details[6]).text().trim();
    additional_cost = $$(details[7]).text().trim();
    total_rent = $$(details[8]).text().trim();
    rental_bond = $$(details[9]).text().trim();
    possible_from = $$(details[10]).text().trim();
    time_limitation = $$(details[11]).text().trim();
    requested_services = $$(details[12]).text().trim();
    additional_services = $$(details[13]).text().trim();
    features = $$(details[14]).text().trim();
    transportation = $$(details[15]).text().trim();
    distance = $$(details[16]).text().trim();
    remark = $$(details[17]).text().trim();
    
    console.log(total_rent);
}

async function scrapeOffer(index, element, $)
{
   const offer_url = base_url + $(element).find('a').attr('href');
   
   const html = await getHtml(offer_url);

   const $$ = cheerio.load(html, {
       normalizeWhitespace: true
    });

    const details = $$('li[class=o-media]').children('span[class=o-media__body]');
    parseOffer(details, $$);
}

async function getHtml(url)
{
    try
    {
        const response = await fetch(url);
        if(response.ok)
        {
            return response.text();
        }
    }
    catch (error)
    {
        console.log(error);
    }
}

getHtml(mainpage_url).then(html => {
    const $ = cheerio.load(html, {
        normalizeWhitespace: true
    });
    
    const all_offers = $('tr[class=tx_stwmprivatzimmervermittlung_list]');
    
    all_offers.each((i, element) => scrapeOffer(i, element, $));
});