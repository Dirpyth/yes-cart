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

package org.yes.cart.service.dto.impl;

import org.junit.Before;
import org.junit.Test;
import org.yes.cart.BaseCoreDBTestCase;
import org.yes.cart.constants.AttributeGroupNames;
import org.yes.cart.constants.DtoServiceSpringKeys;
import org.yes.cart.domain.dto.AttributeDTO;
import org.yes.cart.domain.dto.factory.DtoFactory;
import org.yes.cart.domain.entity.Etype;
import org.yes.cart.service.dto.DtoAttributeService;

import java.util.Collections;
import java.util.List;

import static org.junit.Assert.*;

/**
 * User: Igor Azarny iazarny@yahoo.com
 * Date: 09-May-2011
 * Time: 14:12:54
 */
public class DtoAttributeServiceImplTezt extends BaseCoreDBTestCase {

    private DtoAttributeService dtoAttributeService;
    private DtoFactory dtoFactory;

    @Before
    public void setUp() {
        dtoAttributeService = (DtoAttributeService) ctx().getBean(DtoServiceSpringKeys.DTO_ATTRIBUTE_SERVICE);
        dtoFactory = (DtoFactory) ctx().getBean(DtoServiceSpringKeys.DTO_FACTORY);
        super.setUp();
    }

    @Test
    public void testCreate() throws Exception {
        AttributeDTO dto = getDto();
        dto = dtoAttributeService.create(dto);
        assertTrue(dto.getAttributeId() > 0);
        assertTrue(        hasAttributeWithCode(
                dtoAttributeService.findByAttributeGroupCode(AttributeGroupNames.PRODUCT),
                "TESTCODE"
        ));
    }

    private boolean hasAttributeWithCode(List<AttributeDTO> attributeDTOs, String code) {

        for (AttributeDTO dto : attributeDTOs) {
            if (dto.getCode().equals(code)) {
                return true;
            }

        }
        return false;

    }

    @Test
    public void testUpdate() throws Exception {
        AttributeDTO dto = getDto();
        dto.setCode("A-001");
        dto = dtoAttributeService.create(dto);
        long id = dto.getAttributeId();
        assertTrue(dto.getAttributeId() > 0);
        assertEquals("string value", dto.getVal());
        dto.setVal("i love you meat bags");
        dtoAttributeService.update(dto);
        dto = dtoAttributeService.getById(id);
        assertEquals("i love you meat bags", dto.getVal());
    }

    @Test
    public void testFindByAttributeGroupCode() throws Exception {
        List<AttributeDTO> dtos = dtoAttributeService.findByAttributeGroupCode("CATEGORY");
        assertNotNull(dtos);
        assertEquals(10, dtos.size());
        dtos = dtoAttributeService.findByAttributeGroupCode("NONEXISTINGGROUP");
        assertNotNull(dtos);
        assertTrue(dtos.isEmpty());
    }


    @Test
    public void testFindAttributes() throws Exception {
        // by code
        List<AttributeDTO> dtos = dtoAttributeService.findAttributes(createSearchContext("code", false, 0, 10,
                "filter", "#image0",
                "groups", "CATEGORY"
        )).getItems();
        assertNotNull(dtos);
        assertEquals(1, dtos.size());
        // invalid code
        dtos = dtoAttributeService.findAttributes(createSearchContext("code", false, 0, 10,
                "filter", "!image",
                "groups", "CATEGORY"
        )).getItems();
        assertNotNull(dtos);
        assertEquals(0, dtos.size());
        // valid exact code
        dtos = dtoAttributeService.findAttributes(createSearchContext("code", false, 0, 10,
                "filter", "!category_image0",
                "groups", "CATEGORY"
        )).getItems();
        assertNotNull(dtos);
        assertEquals(1, dtos.size());
        // partial code
        dtos = dtoAttributeService.findAttributes(createSearchContext("code", false, 0, 10,
                "filter", "#image",
                "groups", "CATEGORY"
        )).getItems();
        assertNotNull(dtos);
        assertEquals(2, dtos.size());
        dtos = dtoAttributeService.findAttributes(createSearchContext("code", false, 0, 10,
                "filter", "category description",
                "groups", "CATEGORY"
        )).getItems();
        assertNotNull(dtos);
        assertEquals(1, dtos.size());
    }


    @Test
    public void testFindAvailableAttributes() throws Exception {
        List<AttributeDTO> dtos = dtoAttributeService.findAvailableAttributes(
                "CATEGORY",
                Collections.singletonList("CATEGORY_ITEMS_PER_PAGE")
        );
        assertNotNull(dtos);
        assertEquals(9, dtos.size());
        for (AttributeDTO dto : dtos) {
            assertFalse("CATEGORY_ITEMS_PER_PAGE".equals(dto.getCode()));
        }
    }

    @Test
    public void testFindAttributesWithMultipleValues() throws Exception {
        List<AttributeDTO> dtos = dtoAttributeService.findAttributesWithMultipleValues(
                "PRODUCT");
        assertNotNull(dtos);
        assertFalse(dtos.isEmpty());
        for (AttributeDTO dto : dtos) {
            assertTrue(dto.isAllowduplicate());
        }
        dtos = dtoAttributeService.findAttributesWithMultipleValues(
                "SYSTEM");
        assertNull(dtos);
    }

    private AttributeDTO getDto() {
        AttributeDTO dto = dtoFactory.getByIface(AttributeDTO.class);
        dto.setCode("TESTCODE");
        dto.setMandatory(true);
        dto.setVal("string value");
        dto.setName("test attr");
        dto.setDescription("test attr description");
        dto.setEtype(Etype.STRING_BUSINESS_TYPE);
        dto.setAttributegroup(AttributeGroupNames.PRODUCT);
        dto.setAllowduplicate(true);
        dto.setAllowfailover(false);
        dto.setRegexp("[a-zA-Z]");
        return dto;
    }
}
