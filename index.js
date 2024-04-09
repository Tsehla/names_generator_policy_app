const fs = require('fs');
const { fakerZU_ZA: faker } = require('@faker-js/faker');

// Function to generate a random unique South African ID number
const year_twoDigitArray = [];
for (let i = 30; i <= 99; i++) {
    const twoDigitNumber = i < 10 ? '0' + i : String(i);
    year_twoDigitArray.push(twoDigitNumber);
}

const month_twoDigitArray = [];
for (let i = 1; i <= 12; i++) {  
    const twoDigitNumber = i < 10 ? '0' + i : String(i);
    month_twoDigitArray.push(twoDigitNumber);
}

const day_twoDigitArray = [];
for (let i = 1; i <= 27; i++) { //capped day to 27 days, for february
    const twoDigitNumber = i < 10 ? '0' + i : String(i);
    day_twoDigitArray.push(twoDigitNumber);
}


function generateIDNumber(existingIDs) {
    let idNumber;
    do {
        // idNumber = '9'; // South African ID numbers start with 9
        idNumber = ''; // South African ID numbers start with 9
        // for (let i = 1; i < 13; i++) {
        for (let i = 1; i < 8; i++) {
            idNumber += Math.floor(Math.random() * 10);
        }
    } while (existingIDs.has(idNumber));
    return faker.helpers.arrayElement(year_twoDigitArray) + faker.helpers.arrayElement(month_twoDigitArray) + faker.helpers.arrayElement(day_twoDigitArray) + idNumber;
}

// Function to generate a family member
function generateFamilyMember(existingIDs, fatherLastName, relationship = null) {
    const name = faker.person.firstName();
    const surname = fatherLastName && relationship === 'Father' || relationship === 'Mother' || relationship === 'Son'|| relationship === 'Daughter' || relationship === 'Brother'|| relationship === 'Sister'|| relationship === 'Husband'|| relationship === 'Wife' ?fatherLastName : faker.person.lastName(); // Assign father's last name to the child
    const contactNumber = faker.helpers.arrayElement(['071', '090','060', '061', '062', '063', '064', '065','010', '011', '012', '013', '014', '015', '016', '017', '018', '019', '021', '022', '023', '024', '025', '026', '027', '028', '029', '031', '032', '033', '034', '035', '036', '037', '038', '039', '041', '042', '043', '044', '045', '046', '047', '048', '049', '051', '052', '053', '054', '055', '056', '057', '058', '059', '072', '073', '074', '082', '083', '084', '085', '086', '087', '088', '089', '098', '099']) +(faker.string.numeric(7));
    const homeAddress = faker.location.streetAddress();
    const idNumber = generateIDNumber(existingIDs);
    const gender = faker.helpers.arrayElement([
        'Male',
        'Female',
        'Non-Binary',
        'Transgender Male',
        'Transgender Female',
        'Genderqueer',
        'Genderfluid',
        'Agender',
        'Bigender',
        'Pangender',
        'Two-Spirit',
        'Other'
    ]);
    return {
        name,
        surname,
        contactNumber,
        homeAddress,
        idNumber,
        gender,
        relationship
    };
}

// Function to generate a family tree
function generateFamilyTrees(numTrees, familiesPerFile, maxFamilyMembers) {
    for (let treeIndex = 0; treeIndex < numTrees; treeIndex++) {
        const allFamilies = [];
        
        // Generate families
        for (let familyIndex = 0; familyIndex < familiesPerFile; familyIndex++) {
            const familyMembers = [];
            const existingIDs = new Set();

            // Generate parents
            const father = generateFamilyMember(existingIDs, null);
            delete father.relationship;
            familyMembers.push(father);

            // Generate children
            const numChildren = Math.floor(Math.random() * (maxFamilyMembers - 1)); // Random number of children up to maxFamilyMembers
            for (let i = 0; i < numChildren; i++) {
                const child = generateFamilyMember(existingIDs, father.surname, faker.helpers.arrayElement([
                    'Father',
                    'Mother',
                    'Son',
                    'Daughter',
                    'Brother',
                    'Sister',
                    'Grandfather',
                    'Grandmother',
                    'Grandson',
                    'Granddaughter',
                    'Uncle',
                    'Aunt',
                    'Nephew',
                    'Niece',
                    'Cousin',
                    'Husband',
                    'Wife',
                    'Partner',
                    'Friend'
                ]));
                familyMembers.push(child);
            }

            // Add relationships
            // for (let i = 1; i < familyMembers.length; i++) {
            //     const relationship = faker.helpers.arrayElement([
            //         'Father',
            //         'Mother',
            //         'Son',
            //         'Daughter',
            //         'Brother',
            //         'Sister',
            //         'Grandfather',
            //         'Grandmother',
            //         'Grandson',
            //         'Granddaughter',
            //         'Uncle',
            //         'Aunt',
            //         'Nephew',
            //         'Niece',
            //         'Cousin',
            //         'Husband',
            //         'Wife',
            //         'Partner',
            //         'Friend'
            //     ]);
            //     familyMembers[i].relationship = relationship;
            // }

            allFamilies.push(familyMembers);
        }

        // Write family trees to file
        const filename = `family_trees_${treeIndex + 1}.json`;
        fs.writeFileSync('./relationships/' + filename, JSON.stringify(allFamilies, null, 2));
        console.log(`Family trees ${treeIndex + 1} generated and saved as ${filename}`);
    }
}

// Generate family trees
const numTrees = 20; // Change this to generate desired number of family trees
const familiesPerFile = 50; // Change this to set the number of families per JSON file
const maxFamilyMembers = 10; // Change this to set the maximum number of family members per family
generateFamilyTrees(numTrees, familiesPerFile, maxFamilyMembers);


// Read each JSON file and generate HTML
function generateHTMLFromJSON() {
    const files = fs.readdirSync('./relationships');
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const jsonData = JSON.parse(fs.readFileSync(`./relationships/${file}`, 'utf-8'));
            const htmlContent = generateHTMLTable(jsonData);
            const htmlFileName = file.replace('.json', '.html');
            fs.writeFileSync(`./relationships/${htmlFileName}`, htmlContent);
            console.log(`HTML file ${htmlFileName} generated.`);
        }
    });
}

// Generate HTML table from JSON data
function generateHTMLTable(jsonData) {
    let htmlContent = '<!DOCTYPE html>\n<html>\n<head>\n<title>Family Tree</title>\n</head>\n<body>\n';

    jsonData.forEach((family, index) => {
        htmlContent += `<h2>Family ${index + 1}</h2>`;
        htmlContent += '<table border="1">\n';
        htmlContent += '<tr><th>Name</th><th>Surname</th><th>Contact Number</th><th>Home Address</th><th>ID Number</th><th>Gender</th><th>Relationship</th></tr>\n';

        family.forEach(member => {
            htmlContent += `<tr>`;
            htmlContent += `<td>${member.name}</td>`;
            htmlContent += `<td>${member.surname}</td>`;
            htmlContent += `<td>${member.contactNumber}</td>`;
            htmlContent += `<td>${member.homeAddress}</td>`;
            htmlContent += `<td>${member.idNumber}</td>`;
            htmlContent += `<td>${member.gender}</td>`;
            htmlContent += `<td>${member.relationship || ''}</td>`;
            htmlContent += `</tr>\n`;
        });

        htmlContent += '</table>\n';
    });

    htmlContent += '</body>\n</html>';
    return htmlContent;
}

// Generate HTML files
generateHTMLFromJSON();
