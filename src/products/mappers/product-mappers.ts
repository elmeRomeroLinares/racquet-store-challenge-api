import { ProductDTO } from '../dto/product.dto';
import { Product } from '../entities/product.entity';

export class ProductMapper {
  static toDTO(product: Product): ProductDTO {
    const productDTO = new ProductDTO();
    productDTO.id = product.id;
    productDTO.name = product.name;
    productDTO.price = product.price;
    productDTO.imageUrl = product.imageUrl;
    productDTO.disabled = product.disabled;
    productDTO.createdAt = product.createdAt;
    productDTO.modifiedAt = product.modifiedAt;
    productDTO.categoryId = product.category.id;
    productDTO.inventoryLevel = product.inventoryLevel;
    return productDTO;
  }
}
