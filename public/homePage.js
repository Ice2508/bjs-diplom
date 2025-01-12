


"use strict";

//выход из личного кабинета

const logoutButton = new LogoutButton();

logoutButton.action = function() {
  ApiConnector.logout((responseBody) => {
    if (responseBody.success) {
      location.reload();
    } 
  });
};

ApiConnector.current((data) => {
  if (data.success) {
    ProfileWidget.showProfile(data.data);
  } 
});

//Отображение курса валют

const ratesBoard = new RatesBoard();

function handleStocksData(response) {
  if (response.success) {
    ratesBoard.clearTable();
    ratesBoard.fillTable(response.data);
  } 
}

function updateRates() {
  ApiConnector.getStocks((data) => {
    if (data.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(data.data);
    }
  });
}

updateRates();

setInterval(updateRates, 60000);

//пополнение баланса

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = (data) => {
  ApiConnector.addMoney(data, (response) => {
    if (response.success) {
      ApiConnector.current((profileResponse) => {
        if (profileResponse.success) {
          showProfile(profileResponse.data);
        }
      });
      moneyManager.setMessage(true, "Баланс успешно пополнен.");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};

//конвертация валют

moneyManager.conversionMoneyCallback = (data) => {
  ApiConnector.convertMoney(data, (response) => {
    if (response.success) {
      ApiConnector.current((profileResponse) => {
        if (profileResponse.success) {
          showProfile(profileResponse.response);
        }
      });
      moneyManager.setMessage(true, "Конвертация успешно выполнена.");
    } else {
      moneyManager.setMessage(false, response.error);
    }
  });
};

// перевод валют

moneyManager.sendMoneyCallback = (data) => {
  ApiConnector.transferMoney(data, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(true, "Перевод выполнен успешно!");
    } else {
      moneyManager.setMessage(false, `Ошибка перевода: ${response.error}`);
    }
  });
};

//избранное 

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  } else {
    favoritesWidget.setMessage(false, response.error);
  }
});

favoritesWidget.addUserCallback = (data) => {
  ApiConnector.addUserToFavorites(data, (response) => {
    if (response.success) {
      favoritesWidget.setMessage(true, 'Пользователь успешно добавлен в избранное');
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  });
};

favoritesWidget.removeUserCallback = (userId) => {
  ApiConnector.removeUserFromFavorites(userId, (response) => {
    if (response.success) {
      favoritesWidget.setMessage(true, 'Пользователь успешно удалён из избранного');
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      favoritesWidget.setMessage(false, response.error);
    }
  });
};