-- Initialisation SQL for YesCart
-- @author Denys Pavlov

CREATE DATABASE yes CHARACTER SET utf8 COLLATE utf8_general_ci;

SET character_set_client = utf8;
SET character_set_results = utf8;
SET character_set_connection = utf8;

-- grant statement creates the user if the user does not exist (as long as the no_auto_create_user is not set).
GRANT ALL ON yes.* TO yes@localhost IDENTIFIED BY 'y3$PaSs';

CREATE DATABASE yespay CHARACTER SET utf8 COLLATE utf8_general_ci;
-- grant statement creates the user if the user does not exist (as long as the no_auto_create_user is not set).
GRANT ALL ON yespay.* TO yespay@localhost IDENTIFIED BY 'y3$PaSs';

SET foreign_key_checks = 0;

USE yespay;

SOURCE payment-modules/payment-module-base/src/main/resources/sql/mysql/create-tables.sql;
SOURCE payment-modules/payment-module-base/src/main/resources/sql/payinitdata.sql;
SOURCE payment-modules/payment-module-liqpay/src/main/resources/sql/payinitdata.sql;
SOURCE payment-modules/payment-module-cybersource/src/main/resources/sql/payinitdata.sql;
SOURCE payment-modules/payment-module-authorizenet/src/main/resources/sql/payinitdata.sql;
SOURCE payment-modules/payment-module-paypal/src/main/resources/sql/payinitdata.sql;
SOURCE payment-modules/payment-module-paysera/src/main/resources/sql/payinitdata.sql;
SOURCE payment-modules/payment-module-postfinance/src/main/resources/sql/payinitdata.sql;

USE yes;

SOURCE persistence/sql/resources/mysql/create-tables.sql;
SOURCE env/setup/dbi/initdata.sql;

SET foreign_key_checks = 1;
