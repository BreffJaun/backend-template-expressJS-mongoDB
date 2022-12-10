// S E T:  C O N T R O L L E R

// For Wrong Paths
const wrongGetController = (req, res) => {
  res.status(404).send(`Unknown path ${req.url}! Please check your path!`);
};

const wrongPutController = (req, res) => {
  res.status(404).send(`Unknown path ${req.url}! Please check your path!`);
};

const wrongPostController = (req, res) => {
  res.status(404).send(`Unknown path ${req.url}! Please check your path!`);
};

const wrongDeleteController = (req, res) => {
  res.status(404).send(`
  Unknown path ${req.url}! Please check your path!`);
}

export {
  wrongGetController,
  wrongPutController,
  wrongPostController,
  wrongDeleteController
}