const fs = require('fs');
const { fakerZU_ZA: faker } = require('@faker-js/faker');

// Function to generate a random unique South African ID number
function generateIDNumber(existingIDs) {
    let idNumber;
    do {
        // idNumber = '9'; // South African ID numbers start with 9
        idNumber = ''; // South African ID numbers start with 9
        // for (let i = 1; i < 13; i++) {
        for (let i = 1; i < 14; i++) {
            idNumber += Math.floor(Math.random() * 10);
        }
    } while (existingIDs.has(idNumber));
    return idNumber;
}

// Function to generate a family member
function generateFamilyMember(existingIDs, relationship = null) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
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
            const father = generateFamilyMember(existingIDs);
            delete father.relationship;
            familyMembers.push(father);

            // Generate children
            const numChildren = Math.floor(Math.random() * (maxFamilyMembers - 1)); // Random number of children up to maxFamilyMembers
            for (let i = 0; i < numChildren; i++) {
                const child = generateFamilyMember(existingIDs, faker.helpers.arrayElement(['Son', 'Daughter']));
                familyMembers.push(child);
            }

            // Add relationships
            for (let i = 1; i < familyMembers.length; i++) {
                const relationship = faker.helpers.arrayElement([
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
                ]);
                familyMembers[i].relationship = relationship;
            }

            allFamilies.push(familyMembers);
        }

        // Write family trees to file
        const filename = `family_trees_${treeIndex + 1}.json`;
        fs.writeFileSync('./relationships/' + filename, JSON.stringify(allFamilies, null, 2));
        console.log(`Family trees ${treeIndex + 1} generated and saved as ${filename}`);
    }
}

// Generate family trees
const numTrees = 2; // Change this to generate desired number of family trees
const familiesPerFile = 30; // Change this to set the number of families per JSON file
const maxFamilyMembers = 10; // Change this to set the maximum number of family members per family
generateFamilyTrees(numTrees, familiesPerFile, maxFamilyMembers);
