/*
 * Copyright 2009 Inspire-Software.com
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package org.yes.cart.service.domain;

import org.yes.cart.domain.entity.AttributeGroup;

/**
 * User: Igor Azarny iazarny@yahoo.com
 * Date: 07-May-2011
 * Time: 11:13:01
 */
public interface AttributeGroupService extends GenericService<AttributeGroup> {

    /**
     * Get single attribute by given code.
     *
     * @param code given code
     * @return {@link AttributeGroup} if found, otherwise null.
     */
    AttributeGroup getAttributeGroupByCode(String code);


    /**
     * Delete  {@link AttributeGroup} by given code.
     *
     * @param code code of {@link AttributeGroup} to delete
     */
    void delete(String code);

}
