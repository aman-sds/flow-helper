module.exports = {
  parserOpts: {
    headerPattern: /(.*): (.*) (#[A-Z]*-\d*) State (Peer review|In progress) work Development (\d*)(h|m)$/,
    headerCorrespondence: ['type', 'subject']
  }
};
