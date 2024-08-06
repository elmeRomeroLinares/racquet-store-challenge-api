import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { User } from '@src/authentication/entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProductsQueryDto } from './dto/paginated-products-query.dto';
import { PaginationQueryDto } from '@src/pagination/dto/pagination-query.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let categoryRepository: Repository<Category>;
  let productRepository: Repository<Product>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    categoryRepository = module.get<Repository<Category>>(
      getRepositoryToken(Category),
    );
    productRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('createProductCategory', () => {
    it('should create a new product category', async () => {
      const createProductCategoryDto: CreateProductCategoryDto = {
        name: 'PinPong',
      };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(categoryRepository, 'create')
        .mockReturnValue(createProductCategoryDto as any);
      jest
        .spyOn(categoryRepository, 'save')
        .mockResolvedValue(createProductCategoryDto as any);

      const result = await service.createProductCategory(
        createProductCategoryDto,
      );

      expect(result).toEqual(createProductCategoryDto);
    });

    it('should throw a ConflictException if category already exists', async () => {
      const createProductCategoryDto: CreateProductCategoryDto = {
        name: 'PinPong',
      };

      jest
        .spyOn(categoryRepository, 'findOne')
        .mockResolvedValue(createProductCategoryDto as any);

      await expect(
        service.createProductCategory(createProductCategoryDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('getProductCategories', () => {
    it('should return paginated categories', async () => {
      const paginationQuery: PaginationQueryDto = {
        page: 1,
        limit: 10,
      };

      const categories = [new Category()];
      jest
        .spyOn(categoryRepository, 'findAndCount')
        .mockResolvedValue([categories, 1]);

      const result = await service.getProductCategories(paginationQuery);

      expect(result).toEqual({
        data: categories,
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Wilson Speed Pro',
        price: 1000,
        categoryId: '1',
        imageUrl: 'http://example.com/wilson.jpg',
        disabled: false,
      };

      const category = new Category();
      category.id = '1';

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);
      jest
        .spyOn(productRepository, 'create')
        .mockReturnValue(createProductDto as any);
      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue(createProductDto as any);

      const result = await service.createProduct(createProductDto);

      expect(result).toEqual(createProductDto);
    });

    it('should throw a NotFoundException if category does not exist', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Clash Pro',
        price: 1000,
        categoryId: '1',
        imageUrl: 'http://example.com/laptop.jpg',
        disabled: false,
      };

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(service.createProduct(createProductDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw a ConflictException if product name already exists', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Clash Pro',
        price: 1000,
        categoryId: '1',
        imageUrl: 'http://example.com/laptop.jpg',
        disabled: false,
      };

      const category = new Category();
      category.id = '1';

      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
      jest
        .spyOn(productRepository, 'findOne')
        .mockResolvedValue(createProductDto as any);

      await expect(service.createProduct(createProductDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Clash Pro',
        price: 900,
      };

      const product = new Product();
      product.id = '1';

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest
        .spyOn(productRepository, 'save')
        .mockResolvedValue({ ...product, ...updateProductDto });

      const result = await service.updateProduct('1', updateProductDto);

      expect(result).toEqual({ ...product, ...updateProductDto });
    });

    it('should throw a NotFoundException if product does not exist', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Clash Pro',
        price: 900,
      };

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateProduct('1', updateProductDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw a NotFoundException if category does not exist', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Clash Pro',
        price: 900,
        categoryId: '2',
      };

      const product = new Product();
      product.id = '1';

      jest.spyOn(productRepository, 'findOne').mockResolvedValue(product);
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.updateProduct('1', updateProductDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValue({ affected: 1 } as any);

      const result = await service.deleteProduct('1');

      expect(result).toEqual({ affectedRows: 1 });
    });

    it('should throw a NotFoundException if product does not exist', async () => {
      jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValue({ affected: 0 } as any);

      await expect(service.deleteProduct('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getProducts', () => {
    it('should return paginated products', async () => {
      const paginationQuery: PaginatedProductsQueryDto = {
        page: 1,
        limit: 10,
        categoryId: '1',
      };

      const products = [new Product()];
      jest
        .spyOn(productRepository, 'findAndCount')
        .mockResolvedValue([products, 1]);

      const result = await service.getProducts(paginationQuery);

      expect(result).toEqual({
        data: products,
        total: 1,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('getProduct', () => {
    it('should return a single product', async () => {
      const product = new Product();
      product.id = '1';

      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(product);

      const result = await service.getProduct('1');

      expect(result).toEqual(product);
    });
  });

  describe('likeProduct', () => {
    it("should add a product to user's liked products", async () => {
      const user = new User();
      user.id = '1';
      user.likedProducts = [];

      const product = new Product();
      product.id = '1';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(product);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValue({ ...user, likedProducts: [product] });

      const result = await service.likeProduct('1', '1');

      expect(result).toEqual([product]);
    });

    it('should throw an error if user or product does not exist', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(productRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.likeProduct('1', '1')).rejects.toThrow(Error);
    });
  });
});
