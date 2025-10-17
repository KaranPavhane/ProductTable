namespace productdb;

entity User {
    key userId   : UUID;
        username : String(50);
        password : String(255); // hashed password
        number   : String(15);
        email    : String(100);
        fullName : String(100);
}

entity Product {
    key productId        : UUID;
        productCode      : String(20);
        productName      : String(100);
        description      : String(255);
        category         : String(50);
        brandName        : String(50);
        unitOfMeasure    : String(10);
        weight           : Decimal(10, 2);
        mrp              : Decimal(10, 2);
        discountPercent  : Decimal(5, 2);
        gstPercent       : Decimal(5, 2);
        stockQuantity    : Decimal(10, 2);
        reorderLevel     : Integer;
        expiryDate       : Date;
        manufacturedDate : Date;

        ownerId          : UUID;
        owner            : Association to productdb.User
                               on owner.userId = ownerId;
}
