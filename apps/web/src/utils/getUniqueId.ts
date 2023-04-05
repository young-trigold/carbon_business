let count = 0;

const getUniqueId = () => (Math.random() + count++).toString(32);

export default getUniqueId;
