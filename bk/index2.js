const fs = require('fs');
const randomName = require('random-name'); // Install with: npm install random-name

// Function to validate and generate South African ID number (basic validation)
function generateID() {
  let id = "";
  for (let i = 0; i < 13; i++) {
    id += Math.floor(Math.random() * 10);
  }

  // Basic checksum validation (Luhn Algorithm - first digit verification)
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(id[i]);
    sum += (i % 2 === 0) ? digit : (digit * 2) % 10;
  }
  const checkDigit = (10 - (sum % 10)) % 10;

  return id === `${checkDigit}${id.slice(1)}` ? id : generateID();
}

function generateFamilyMember(locale) {
  const person = randomName(locale);
  return {
    name: person.first,
    surname: person.last,
    contactNumber: "000-000-0000", // Replace with logic to generate phone numbers
    homeAddress: "123 Fake Street", // Replace with logic to generate addresses
    idNumber: generateID(),
    gender: person.gender,
  };
}

function generateFamilyTree(numTrees, locale) {
  const trees = [];
  for (let i = 0; i < numTrees; i++) {
    const family = [];
    // Add parents
    family.push(generateFamilyMember(locale));
    family.push(generateFamilyMember(locale));
    // Add children (replace with logic to generate children with relationships)
    for (let j = 0; j < 2; j++) {
      family.push(generateFamilyMember(locale));
    }
    trees.push(family);
  }
  return trees;
}

function generateTextOutput(familyTree) {
  let output = "";
  for (const family of familyTree) {
    output += "Family:\n";
    for (const member of family) {
      output += `  * ${member.name} ${member.surname} - ${member.idNumber} (Gender: ${member.gender})\n`;
    }
    output += "\n";
  }
  return output;
}

function generatePDFOutput(familyTree, callback) {
  // You'll need a 3rd party library like jsPDF to generate PDFs
  // Replace this with actual PDF generation logic using jsPDF or a similar library
  const textOutput = generateTextOutput(familyTree);
  callback(textOutput); // Simulate generating PDF from text for now
}

const numTrees = process.argv[2] || 1; // Get number of trees from command line argument
const locale = process.argv[3] || "en"; // Get locale from command line argument

const familyTrees = generateFamilyTree(numTrees, locale);

const outputType = process.argv[4] || "text";

if (outputType === "text") {
  console.log(generateTextOutput(familyTrees));
} else if (outputType === "pdf") {
  generatePDFOutput(familyTrees, (text) => console.log("PDF generated (represented as text):\n", text));
} else {
  console.error(`Invalid output type: ${outputType}. Valid options are "text" or "pdf".`);
}

