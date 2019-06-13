CREATE TABLE shop.user
(
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(255),
    user_pass VARCHAR(255),
    user_type INT
);

CREATE TABLE shop.good
(
    good_id INT PRIMARY KEY AUTO_INCREMENT,
    good_name VARCHAR(255),
    good_price VARCHAR(255),
    good_category INT
);

CREATE TABLE shop.category
(
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255)
);


CREATE TABLE shop.shop_order
(
    order_id INT PRIMARY KEY AUTO_INCREMENT,
    create_time DATETIME,
    update_time DATETIME,
    user_id INT,
    order_status INT,
    good_id INT
);


ALTER TABLE shop.user ADD user_age INT NULL;
ALTER TABLE shop.user ADD user_birth_time DATETIME NULL;
ALTER TABLE shop.user ADD user_adress VARCHAR(255) NULL;
ALTER TABLE shop.user ADD user_sex INT NULL;