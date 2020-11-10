import {MigrationInterface, QueryRunner} from "typeorm";

export class changeTableNameCategoryToCategories1605004248584 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameTable('category', 'categories')
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameTable('categories', 'category')
    }

}
