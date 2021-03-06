const Transaction = require('../schemas/transaction');
const Customer = require('../schemas/customer');
const coffee = require('./coffee');

exports.createTransaction = async (transaction, customerId) => {
  let res;
  const coffeToUpdate = await coffee.getCoffee(transaction.coffeeId);
  const remainingCoffee = coffeToUpdate.available - transaction.quantity;
  if (remainingCoffee > 0) {
    await coffee.updateCoffee(transaction.coffeeId, {
      available: remainingCoffee
    });
    let customId;
    if (transaction.customerId) customId = transaction.customerId;
    else customId = customerId;
    res = await Transaction.create({
      id: transaction.id,
      quantity: transaction.quantity,
      price: transaction.price,
      customerId: customId,
      shipperId: transaction.shipperId,
      coffeeId: transaction.coffeeId,
      total: transaction.total,
      status_code: transaction.status_code
    });
    return res;
  } else {
    return { error: 'not enough coffee available from the producer' };
  }
};

exports.getCustomerAndTransactions = async id => {
  const res = await Customer.find({
    include: [{ model: Transaction }],
    where: { id: id }
  });
  return res.transactions;
};

exports.getAllTransactions = async () => {
  //for development only :)
  const res = await Transaction.findAll();
  return res;
};

exports.getSpecificTransaction = async id => {
  const transaction = await Transaction.find({
    where: { id: id }
  });
  return transaction;
};

exports.updateTransaction = async (info, id) => {
  let updateValue = {};
  if (info.quantity) updateValue.quantity = info.quantity;
  if (info.price) updateValue.price = info.price;
  if (info.total) updateValue.total = info.total;
  if (info.status_code) updateValue.status_code = info.status_code;
  await Transaction.update(updateValue, {
    returning: true,
    plain: true,
    where: { id: id }
  });
  const updatedTransaction = await Transaction.find({
    where: { id: id }
  });
  return updatedTransaction;
};
