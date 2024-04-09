const fs = require('fs');
const { fakerZU_ZA: faker } = require('@faker-js/faker');

// Function to generate a random unique South African ID number
function generateIDNumber(existingIDs) {
    let idNumber;
    do {
        idNumber = '9'; // South African ID numbers start with 9
        for (let i = 1; i < 13; i++) {
            idNumber += Math.floor(Math.random() * 10);
        }
    } while (existingIDs.has(idNumber));
    return idNumber;
}

// Function to generate a family member
function generateFamilyMember(existingIDs, relationship) {
    const name = faker.person.firstName();
    const surname = faker.person.lastName();
    const contactNumber = faker.string.numeric(10);
    const homeAddress = faker.location.streetAddress();
    const idNumber = generateIDNumber(existingIDs);
    const gender = faker.helpers.arrayElement(['Male', 'Female']);
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
function generateFamilyTree(numTrees) {
    for (let treeIndex = 0; treeIndex < numTrees; treeIndex++) {
        const familyMembers = [];
        const existingIDs = new Set();

        // Generate parents
        const father = generateFamilyMember(existingIDs, 'Father');
        const mother = generateFamilyMember(existingIDs, 'Mother');
        familyMembers.push(father, mother);

        // Generate children
        const numChildren = Math.floor(Math.random() * 5); // Up to 5 children
        for (let i = 0; i < numChildren; i++) {
            const child = generateFamilyMember(existingIDs, 'Child');
            familyMembers.push(child);
        }

        // Add relationships
        for (let i = 2; i < familyMembers.length; i++) {
            const relationship = faker.helpers.arrayElement(['Son', 'Daughter', 'Brother', 'Sister', 'Cousin']);
            familyMembers[i].relationship = relationship;
        }

        // Write family tree to file
        const filename = `family_tree_${treeIndex + 1}.json`;
        fs.writeFileSync('./relationships/' + filename, JSON.stringify(familyMembers, null, 2));
        console.log(`Family tree ${treeIndex + 1} generated and saved as ${filename}`);
    }
}

// Generate family trees
const numTrees = 20; // Change this to generate desired number of family trees
generateFamilyTree(numTrees);
